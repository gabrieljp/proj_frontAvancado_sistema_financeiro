import type { FormEvent } from "react";
import { Field, Icon } from "./components";
import { date, money, today } from "./format";
import type { Categoria, Lancamento, Pessoa } from "./types";

interface Props {
  pessoas: Pessoa[];
  categorias: Categoria[];
  visible: Lancamento[];
  loading: boolean;
  failed: boolean;
  search: string;
  filters: string;
  setSearch: (s: string) => void;
  filter: (e: FormEvent<HTMLFormElement>) => void;
  clear: () => void;
  exportCsv: () => void;
  edit: (l: Lancamento) => void;
  remove: (l: Lancamento) => void;
}
export function Transactions({
  pessoas,
  categorias,
  visible,
  loading,
  failed,
  search,
  setSearch,
  filter,
  clear,
  filters,
  exportCsv,
  edit,
  remove,
}: Props) {
  const sum = (tipo: string) =>
    visible
      .filter((l) => l.tipo === tipo)
      .reduce((s, l) => s + Math.round(l.valor * 100), 0) / 100;
  const receitas = sum("RECEITA"),
    despesas = sum("DESPESA");
  return (
    <>
      <div className="summary">
        <article className="balance">
          <div className="card-label">
            Saldo previsto <Icon name="wallet" />
          </div>
          <strong>
            {loading || failed ? "—" : money(receitas - despesas)}
          </strong>
          <small>Receitas menos despesas do resultado</small>
        </article>
        <article>
          <div className="card-label">
            Receitas{" "}
            <span className="round-icon income">
              <Icon name="down" />
            </span>
          </div>
          <strong className="income-text">
            {loading || failed ? "—" : money(receitas)}
          </strong>
          <small>
            {visible.filter((l) => l.tipo === "RECEITA").length} lançamentos de
            entrada
          </small>
        </article>
        <article>
          <div className="card-label">
            Despesas{" "}
            <span className="round-icon expense">
              <Icon name="up" />
            </span>
          </div>
          <strong>{loading || failed ? "—" : money(despesas)}</strong>
          <small>
            {visible.filter((l) => l.tipo === "DESPESA").length} lançamentos de
            saída
          </small>
        </article>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Movimentações</h2>
            <p>Seu extrato, com os detalhes que importam.</p>
          </div>
          <button
            className="secondary"
            onClick={exportCsv}
            disabled={loading || failed || !visible.length}
          >
            <Icon name="download" />
            Exportar CSV
          </button>
        </div>
        <form className="filters" onSubmit={filter} onReset={clear}>
          <Field label="Vencimento de">
            <input type="date" name="inicio" />
          </Field>
          <Field label="Até">
            <input type="date" name="fim" />
          </Field>
          <Field label="Pessoa">
            <select name="pessoaId">
              <option value="">Todas as pessoas</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                  {!p.ativo && " (inativa)"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Categoria">
            <select name="categoriaId">
              <option value="">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tipo">
            <select name="tipo">
              <option value="">Todos os tipos</option>
              <option>RECEITA</option>
              <option>DESPESA</option>
            </select>
          </Field>
          <button className="filter-button" disabled={loading}>
            Filtrar
          </button>
          <button className="text-button" type="reset">
            Limpar
          </button>
        </form>
        <div className="table-tools">
          <span>
            {loading
              ? "Carregando…"
              : `${visible.length} ${visible.length === 1 ? "lançamento encontrado" : "lançamentos encontrados"}`}
          </span>
          <input
            aria-label="Buscar pela descrição"
            placeholder="Buscar pela descrição…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Descrição / Pessoa</th>
                <th>Categoria</th>
                <th>Vencimento</th>
                <th>Situação</th>
                <th className="number">Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                !failed &&
                visible.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div className="transaction">
                        <span
                          className={`round-icon ${l.tipo === "RECEITA" ? "income" : "expense"}`}
                        >
                          <Icon name={l.tipo === "RECEITA" ? "down" : "up"} />
                        </span>
                        <div>
                          <strong>{l.descricao}</strong>
                          <small>{l.pessoa.nome}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{l.categoria.nome}</span>
                    </td>
                    <td>{date(l.dataVencimento)}</td>
                    <td>
                      <span
                        className={`badge ${l.dataPagamento ? "paid" : l.dataVencimento < today() ? "late" : "pending"}`}
                      >
                        {l.dataPagamento
                          ? l.tipo === "RECEITA"
                            ? "Recebido"
                            : "Pago"
                          : l.dataVencimento < today()
                            ? "Vencido"
                            : "Pendente"}
                      </span>
                      {l.dataPagamento && (
                        <small>{date(l.dataPagamento)}</small>
                      )}
                    </td>
                    <td
                      className={`number value ${l.tipo === "RECEITA" ? "income-text" : ""}`}
                    >
                      {l.tipo === "RECEITA" ? "+" : "−"} {money(l.valor)}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          onClick={() => edit(l)}
                          aria-label={`Editar ${l.descricao}`}
                        >
                          Editar
                        </button>
                        <button
                          className="danger-text"
                          onClick={() => remove(l)}
                          aria-label={`Excluir ${l.descricao}`}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!loading && !failed && !visible.length && (
          <div className="empty">
            <span className="empty-icon">
              <Icon name="list" />
            </span>
            <h3>
              {filters || search
                ? "Nenhum resultado por aqui"
                : "Seu primeiro movimento começa aqui"}
            </h3>
            <p>
              {filters || search
                ? "Ajuste os filtros para encontrar outros lançamentos."
                : "Cadastre uma pessoa e uma categoria, depois registre uma receita ou despesa."}
            </p>
          </div>
        )}
        {loading && (
          <div className="empty" role="status">
            Carregando movimentações…
          </div>
        )}
        <div className="panel-footer">
          <span>Valores em real (BRL)</span>
          <span>O saldo previsto inclui lançamentos pagos e pendentes.</span>
        </div>
      </section>
    </>
  );
}
