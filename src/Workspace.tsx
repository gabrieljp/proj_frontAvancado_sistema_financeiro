import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError, refreshCsrf } from "./api";
import { Brand, Icon, Modal } from "./components";
import { date, message, today } from "./format";
import { RecordForm } from "./RecordForm";
import type { Editor } from "./RecordForm";
import { Transactions } from "./Transactions";
import type { Categoria, Lancamento, Pessoa, Tela } from "./types";

export function Workspace({
  user,
  expire,
}: {
  user: string;
  expire: () => void;
}) {
  const [tela, setTela] = useState<Tela>("Visão geral");
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [filters, setFilters] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [formError, setFormError] = useState("");
  const [remove, setRemove] = useState<{
    tipo: "categorias" | "lancamentos";
    id: number;
    nome: string;
  } | null>(null);
  const requestId = useRef(0);
  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) expire();
      return message(err);
    },
    [expire],
  );
  const load = useCallback(
    (query: string, signal?: AbortSignal) => {
      const id = ++requestId.current;
      return Promise.all([
          api<Pessoa[]>("/pessoas", { signal }),
          api<Categoria[]>("/categorias", { signal }),
          api<Lancamento[]>(`/lancamentos?${query}`, { signal }),
        ]).then(([p, c, l]) => {
        if (!signal?.aborted && id === requestId.current) {
          setPessoas(p);
          setCategorias(c);
          setLancamentos(l);
          setError("");
        }
      }).catch((err: unknown) => {
        if (!signal?.aborted && id === requestId.current)
          setError(handleError(err));
      }).finally(() => {
        if (!signal?.aborted && id === requestId.current) setLoading(false);
      });
    },
    [handleError],
  );
  useEffect(() => {
    const controller = new AbortController();
    void load(filters, controller.signal);
    return () => controller.abort();
  }, [load, filters]);
  function open(tipo: Editor["tipo"], item?: Editor["item"]) {
    setFormError("");
    setNotice("");
    setEditor({ tipo, item });
  }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editor) return;
    const f = new FormData(e.currentTarget),
      val = (key: string) => String(f.get(key) || "").trim();
    let payload: object, path: string;
    if (editor.tipo === "pessoa") {
      payload = {
        nome: val("nome"),
        ativo: f.get("ativo") === "on",
        endereco: Object.fromEntries(
          [
            "logradouro",
            "numero",
            "complemento",
            "bairro",
            "cep",
            "cidade",
            "estado",
          ].map((k) => [k, val(k)]),
        ),
      };
      path = "/pessoas";
    } else if (editor.tipo === "categoria") {
      payload = { nome: val("nome") };
      path = "/categorias";
    } else {
      payload = {
        descricao: val("descricao"),
        tipo: val("tipo"),
        valor: Number(val("valor")),
        dataVencimento: val("dataVencimento"),
        dataPagamento: val("dataPagamento") || null,
        observacao: val("observacao"),
        pessoaId: Number(val("pessoaId")),
        categoriaId: Number(val("categoriaId")),
      };
      path = "/lancamentos";
    }
    setSaving(true);
    setFormError("");
    try {
      await api(path + (editor.item ? `/${editor.item.id}` : ""), {
        method: editor.item ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setEditor(null);
      setNotice("Registro salvo com sucesso.");
      await load(filters);
    } catch (err) {
      setFormError(handleError(err));
    } finally {
      setSaving(false);
    }
  }
  async function toggle(p: Pessoa) {
    setSaving(true);
    setError("");
    try {
      await api(`/pessoas/${p.id}/ativo?valor=${!p.ativo}`, {
        method: "PATCH",
      });
      setNotice(
        p.ativo
          ? "Pessoa inativada. O histórico foi preservado."
          : "Pessoa ativada.",
      );
      await load(filters);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setSaving(false);
    }
  }
  async function deleteRecord() {
    if (!remove) return;
    setSaving(true);
    try {
      await api(`/${remove.tipo}/${remove.id}`, { method: "DELETE" });
      setRemove(null);
      setNotice("Registro excluído.");
      await load(filters);
    } catch (err) {
      setRemove(null);
      setError(handleError(err));
    } finally {
      setSaving(false);
    }
  }
  async function logout() {
    try {
      await api("/logout", { method: "POST" });
      await refreshCsrf();
      expire();
    } catch (err) {
      setError(handleError(err));
    }
  }
  function filter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (
      f.get("inicio") &&
      f.get("fim") &&
      String(f.get("inicio")) > String(f.get("fim"))
    ) {
      setError("Data inicial deve ser anterior ou igual à final.");
      return;
    }
    const q = new URLSearchParams();
    f.forEach((v, k) => {
      if (v) q.set(k, String(v));
    });
    setLoading(true);
    if (filters === q.toString()) void load(filters);
    else setFilters(q.toString());
  }
  const visible = lancamentos.filter((l) =>
    l.descricao
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );
  function exportCsv() {
    const safe = (s: string | number) =>
      `"${String(s)
        .replace(/^[=+@\-\t\r]/, "'$&")
        .replaceAll('"', '""')}"`;
    const rows = [
      [
        "Descrição",
        "Tipo",
        "Valor (R$)",
        "Vencimento",
        "Pagamento",
        "Pessoa",
        "Categoria",
        "Observação",
      ],
      ...visible.map((l) => [
        l.descricao,
        l.tipo,
        l.valor.toFixed(2).replace(".", ","),
        date(l.dataVencimento),
        l.dataPagamento ? date(l.dataPagamento) : "",
        l.pessoa.nome,
        l.categoria.nome,
        l.observacao || "",
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(
        ["\uFEFF" + rows.map((r) => r.map(safe).join(";")).join("\r\n")],
        { type: "text/csv;charset=utf-8;" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `extrato-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  const finance = tela === "Visão geral" || tela === "Lançamentos";
  const matching = pessoas.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <span className="nav-label">PRINCIPAL</span>
        <nav aria-label="Menu principal">
          {(
            ["Visão geral", "Lançamentos", "Pessoas", "Categorias"] as Tela[]
          ).map((t, i) => (
            <button
              key={t}
              className={tela === t ? "nav-item active" : "nav-item"}
              aria-current={tela === t ? "page" : undefined}
              onClick={() => {
                setTela(t);
                setSearch("");
                setNotice("");
              }}
            >
              <Icon name={["grid", "list", "users", "tag"][i]} />
              {t}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="version">
            <span className="status-dot" /> Ambiente de teste
            <p>Seu grupo, no controle.</p>
          </div>
          <div className="profile">
            <span className="avatar">{user.slice(0, 2).toUpperCase()}</span>
            <div>
              <strong>{user}</strong>
              <small>Operador</small>
            </div>
            <button
              onClick={logout}
              className="icon-button"
              aria-label="Sair da conta"
            >
              <Icon name="exit" />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span>
            Meu espaço <span className="slash">/</span> <strong>{tela}</strong>
          </span>
          <span className="top-date">
            {new Date().toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </header>
        <main className="content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">GESTÃO FINANCEIRA</span>
              <h1>
                {tela === "Visão geral" ? "Tudo em dia. Tudo à vista." : tela}
              </h1>
              <p>
                {finance
                  ? "Acompanhe suas movimentações e cuide do que vem pela frente."
                  : tela === "Pessoas"
                    ? "Conexões que fazem parte da sua vida financeira."
                    : "Cada movimento no seu lugar."}
              </p>
            </div>
            <button
              className="primary"
              disabled={loading}
              onClick={() =>
                open(
                  tela === "Pessoas"
                    ? "pessoa"
                    : tela === "Categorias"
                      ? "categoria"
                      : "lancamento",
                )
              }
            >
              <Icon name="plus" />
              {tela === "Pessoas"
                ? "Nova pessoa"
                : tela === "Categorias"
                  ? "Nova categoria"
                  : "Novo lançamento"}
            </button>
          </div>
          {error && (
            <div className="alert error" role="alert">
              {error}{" "}
              <button onClick={() => void load(filters)}>
                Tentar novamente
              </button>
            </div>
          )}
          {notice && (
            <div className="alert success" role="status">
              {notice}
            </div>
          )}
          {finance && (
            <Transactions
              {...{
                pessoas,
                categorias,
                visible,
                loading,
                search,
                setSearch,
                filter,
                filters,
              }}
              failed={!!error}
              clear={() => {
                setFilters("");
                setSearch("");
                if (!filters) void load("");
              }}
              exportCsv={exportCsv}
              edit={(l) => open("lancamento", l)}
              remove={(l) =>
                setRemove({ tipo: "lancamentos", id: l.id, nome: l.descricao })
              }
            />
          )}
          {tela === "Pessoas" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Pessoas cadastradas</h2>
                  <p>
                    {pessoas.length} pessoas ·{" "}
                    {pessoas.filter((p) => p.ativo).length} ativas
                  </p>
                </div>
                <input
                  aria-label="Buscar pessoa"
                  placeholder="Buscar pelo nome…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Endereço</th>
                      <th>Cidade / UF</th>
                      <th>Situação</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading &&
                      matching.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.nome}</strong>
                          </td>
                          <td>
                            {p.endereco.logradouro}, {p.endereco.numero}
                            <small>
                              {p.endereco.bairro} · {p.endereco.cep}
                              {p.endereco.complemento &&
                                ` · ${p.endereco.complemento}`}
                            </small>
                          </td>
                          <td>
                            {p.endereco.cidade} / {p.endereco.estado}
                          </td>
                          <td>
                            <span
                              className={`badge ${p.ativo ? "paid" : "neutral"}`}
                            >
                              {p.ativo ? "Ativa" : "Inativa"}
                            </span>
                          </td>
                          <td>
                            <div className="row-actions">
                              <button
                                onClick={() => open("pessoa", p)}
                                aria-label={`Editar ${p.nome}`}
                              >
                                Editar
                              </button>
                              <button
                                disabled={saving}
                                onClick={() => void toggle(p)}
                              >
                                {p.ativo ? "Inativar" : "Ativar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {loading ? (
                <div className="empty" role="status">
                  Carregando pessoas…
                </div>
              ) : (
                !matching.length && (
                  <div className="empty">
                    <h3>Nenhuma pessoa encontrada</h3>
                    <p>
                      Cadastre clientes, fornecedores ou pagadores com seu
                      endereço completo.
                    </p>
                  </div>
                )
              )}
            </section>
          )}
          {tela === "Categorias" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Categorias financeiras</h2>
                  <p>Organize a classificação de suas receitas e despesas.</p>
                </div>
              </div>
              <div className="category-grid">
                {!loading &&
                  categorias.map((c) => (
                    <article className="category-card" key={c.id}>
                      <span className="round-icon income">
                        <Icon name="tag" />
                      </span>
                      <strong>{c.nome}</strong>
                      <div className="row-actions">
                        <button
                          onClick={() => open("categoria", c)}
                          aria-label={`Editar ${c.nome}`}
                        >
                          Editar
                        </button>
                        <button
                          className="danger-text"
                          onClick={() =>
                            setRemove({
                              tipo: "categorias",
                              id: c.id,
                              nome: c.nome,
                            })
                          }
                          aria-label={`Excluir ${c.nome}`}
                        >
                          Excluir
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
              {loading ? (
                <div className="empty" role="status">
                  Carregando categorias…
                </div>
              ) : (
                !categorias.length && (
                  <div className="empty">
                    <h3>Uma organização com a sua cara</h3>
                    <p>
                      Crie categorias como Alimentação, Transporte ou Salário.
                    </p>
                  </div>
                )
              )}
            </section>
          )}
          <footer className="page-footer">
            <span>
              financeiro. <span>Clareza para seguir em frente.</span>
            </span>
            <span>Versão de teste · Revisão do grupo</span>
          </footer>
        </main>
      </div>
      {editor && (
        <Modal
          title={`${editor.item ? "Editar" : editor.tipo === "lancamento" ? "Novo" : "Nova"} ${editor.tipo === "lancamento" ? "lançamento" : editor.tipo}`}
          close={() => {
            if (!saving) setEditor(null);
          }}
        >
          <RecordForm
            {...{ editor, pessoas, categorias, saving, save }}
            error={formError}
            close={() => setEditor(null)}
          />
        </Modal>
      )}
      {remove && (
        <Modal
          title="Excluir registro?"
          close={() => {
            if (!saving) setRemove(null);
          }}
        >
          <div className="confirm-body">
            <p>
              Deseja excluir <strong>{remove.nome}</strong>? Esta ação não pode
              ser desfeita.
            </p>
            {remove.tipo === "categorias" && (
              <p>Categorias com lançamentos vinculados serão preservadas.</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="secondary"
              disabled={saving}
              onClick={() => setRemove(null)}
            >
              Cancelar
            </button>
            <button
              className="danger"
              disabled={saving}
              onClick={() => void deleteRecord()}
            >
              {saving ? "Excluindo…" : "Confirmar exclusão"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
