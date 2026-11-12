import type { FormEvent } from "react";
import { Field } from "./components";
import { today } from "./format";
import type { Categoria, Lancamento, Pessoa } from "./types";

export interface Editor {
  tipo: "pessoa" | "categoria" | "lancamento";
  item?: Pessoa | Categoria | Lancamento;
}
interface Props {
  editor: Editor;
  pessoas: Pessoa[];
  categorias: Categoria[];
  saving: boolean;
  error: string;
  save: (e: FormEvent<HTMLFormElement>) => void;
  close: () => void;
}
const ufs =
  "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(
    " ",
  );
export function RecordForm({
  editor,
  pessoas,
  categorias,
  saving,
  error,
  save,
  close,
}: Props) {
  const p =
    editor.tipo === "pessoa" ? (editor.item as Pessoa | undefined) : undefined;
  const l =
    editor.tipo === "lancamento"
      ? (editor.item as Lancamento | undefined)
      : undefined;
  return (
    <form onSubmit={save}>
      <div className="form-grid">
        {editor.tipo === "categoria" && (
          <Field label="Nome da categoria *" wide>
            <input
              name="nome"
              required
              maxLength={100}
              defaultValue={(editor.item as Categoria)?.nome}
            />
          </Field>
        )}
        {editor.tipo === "pessoa" && (
          <>
            <Field label="Nome completo *" wide>
              <input
                name="nome"
                required
                maxLength={150}
                defaultValue={p?.nome}
              />
            </Field>
            <Field label="Logradouro *" wide>
              <input
                name="logradouro"
                required
                maxLength={150}
                defaultValue={p?.endereco.logradouro}
              />
            </Field>
            <Field label="Número *">
              <input
                name="numero"
                required
                maxLength={20}
                defaultValue={p?.endereco.numero}
              />
            </Field>
            <Field label="Complemento">
              <input
                name="complemento"
                maxLength={100}
                defaultValue={p?.endereco.complemento}
              />
            </Field>
            <Field label="Bairro *">
              <input
                name="bairro"
                required
                maxLength={100}
                defaultValue={p?.endereco.bairro}
              />
            </Field>
            <Field label="CEP *">
              <input
                name="cep"
                required
                pattern="[0-9]{5}-?[0-9]{3}"
                placeholder="00000-000"
                defaultValue={p?.endereco.cep}
              />
            </Field>
            <Field label="Cidade *">
              <input
                name="cidade"
                required
                maxLength={100}
                defaultValue={p?.endereco.cidade}
              />
            </Field>
            <Field label="Estado (UF) *">
              <select
                name="estado"
                required
                defaultValue={p?.endereco.estado || ""}
              >
                <option value="">Selecione</option>
                {ufs.map((uf) => (
                  <option key={uf}>{uf}</option>
                ))}
              </select>
            </Field>
            <label className="checkbox wide">
              <input
                type="checkbox"
                name="ativo"
                defaultChecked={p?.ativo ?? true}
              />{" "}
              Pessoa ativa para novos lançamentos
            </label>
          </>
        )}
        {editor.tipo === "lancamento" && (
          <>
            <Field label="Descrição *" wide>
              <input
                name="descricao"
                required
                maxLength={150}
                defaultValue={l?.descricao}
              />
            </Field>
            <Field label="Tipo *">
              <select name="tipo" defaultValue={l?.tipo || "DESPESA"}>
                <option value="DESPESA">Despesa</option>
                <option value="RECEITA">Receita</option>
              </select>
            </Field>
            <Field label="Valor (R$) *">
              <input
                name="valor"
                type="number"
                step="0.01"
                min="0.01"
                max="9999999999999.99"
                required
                defaultValue={l?.valor}
              />
            </Field>
            <Field label="Vencimento *">
              <input
                name="dataVencimento"
                type="date"
                required
                defaultValue={l?.dataVencimento || today()}
              />
            </Field>
            <Field label="Data do pagamento / recebimento">
              <input
                name="dataPagamento"
                type="date"
                max={today()}
                defaultValue={l?.dataPagamento || ""}
              />
            </Field>
            <Field label="Pessoa ativa *">
              <select
                name="pessoaId"
                required
                defaultValue={l?.pessoa.id || ""}
              >
                <option value="">Selecione uma pessoa</option>
                {pessoas
                  .filter((p) => p.ativo || p.id === l?.pessoa.id)
                  .map((p) => (
                    <option key={p.id} value={p.id} disabled={!p.ativo}>
                      {p.nome}
                      {!p.ativo && " (inativa; selecione outra)"}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Categoria *">
              <select
                name="categoriaId"
                required
                defaultValue={l?.categoria.id || ""}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Observação / histórico" wide>
              <textarea
                name="observacao"
                maxLength={1000}
                rows={3}
                defaultValue={l?.observacao}
              />
            </Field>
            <p className="form-hint wide">
              Deixe o pagamento em branco para um lançamento pendente.{" "}
              {(!pessoas.some((p) => p.ativo) || !categorias.length) &&
                "Cadastre uma pessoa ativa e uma categoria antes de lançar."}
            </p>
          </>
        )}
        {error && (
          <div className="alert error wide" role="alert">
            {error}
          </div>
        )}
      </div>
      <div className="modal-footer">
        <small>* Campos obrigatórios</small>
        <button
          className="secondary"
          type="button"
          disabled={saving}
          onClick={close}
        >
          Cancelar
        </button>
        <button
          className="primary"
          disabled={
            saving ||
            (editor.tipo === "lancamento" &&
              (!pessoas.some((p) => p.ativo) || !categorias.length))
          }
        >
          {saving ? "Salvando…" : "Salvar registro"}
        </button>
      </div>
    </form>
  );
}
