package br.edu.financeiro;

import com.fasterxml.jackson.databind.*;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.*;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:tests;DB_CLOSE_DELAY=-1", "spring.jpa.hibernate.ddl-auto=create-drop"})
@AutoConfigureMockMvc
@Transactional
@WithMockUser(username="operador",roles="OPERADOR")
class FinanceiroIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    Map<String,Object> pessoaBody(boolean ativo) {
        return Map.of("nome","Pessoa Teste","ativo",ativo,"endereco",Map.of("logradouro","Rua das Flores","numero","42","complemento","Sala 2","bairro","Centro","cep","60000-000","cidade","Fortaleza","estado","CE"));
    }
    long criar(String path, Object body) throws Exception {
        var result=mvc.perform(post(path).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body)))
            .andExpect(status().isCreated()).andExpect(header().exists("Location")).andReturn();
        return json.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }
    Map<String,Object> lancamento(long p,long c) {
        return new java.util.HashMap<>(Map.of("descricao","Mensalidade","valor",125.45,"tipo","DESPESA","dataVencimento","2026-11-15","observacao","Histórico","pessoaId",p,"categoriaId",c));
    }
    long pessoa(boolean ativo) throws Exception { return criar("/pessoas",pessoaBody(ativo)); }
    long categoria() throws Exception { return criar("/categorias",Map.of("nome","Educação")); }
    @Test void exigeAutenticacao() throws Exception { mvc.perform(get("/lancamentos").with(anonymous())).andExpect(status().isUnauthorized()); }
    @Test void exigeCsrf() throws Exception { mvc.perform(post("/categorias").contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\"Nova\"}")).andExpect(status().isForbidden()); }
    @Test void loginRealCriaSessaoELogoutEncerra() throws Exception {
        mvc.perform(post("/login").with(anonymous()).with(csrf()).param("username","operador").param("password","errada")).andExpect(status().isUnauthorized());
        var result=mvc.perform(post("/login").with(anonymous()).with(csrf()).param("username","operador").param("password","grupo12345"))
            .andExpect(status().isOk()).andReturn();
        var session=(org.springframework.mock.web.MockHttpSession)result.getRequest().getSession(false);
        assertThat(session).isNotNull();
        assertThat(session.getAttribute("SPRING_SECURITY_CONTEXT")).isNotNull();
        mvc.perform(post("/logout").session(session).with(csrf())).andExpect(status().isNoContent());
        assertThat(session.isInvalid()).isTrue();
    }
    @Test void cadastraEditaEInativaPessoaComEndereco() throws Exception {
        long p=pessoa(true);
        mvc.perform(get("/pessoas/"+p)).andExpect(jsonPath("$.endereco.cidade").value("Fortaleza"));
        var body=new java.util.HashMap<>(pessoaBody(true)); body.put("nome","Pessoa Editada");
        mvc.perform(put("/pessoas/"+p).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isOk()).andExpect(jsonPath("$.nome").value("Pessoa Editada"));
        mvc.perform(patch("/pessoas/"+p+"/ativo?valor=false").with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(false));
        mvc.perform(patch("/pessoas/"+p+"/ativo?valor=true").with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(true));
    }
    @Test void rejeitaEnderecoIncompletoECepInvalido() throws Exception {
        mvc.perform(post("/pessoas").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\"Pessoa\",\"ativo\":true,\"endereco\":{\"cep\":\"123\"}}"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors").isArray());
    }
    @Test void gerenciaCategoriasERejeitaDuplicadas() throws Exception {
        long c=categoria();
        mvc.perform(post("/categorias").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\" educação \"}")).andExpect(status().isConflict());
        mvc.perform(put("/categorias/"+c).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\"Cursos\"}")).andExpect(status().isOk());
        mvc.perform(delete("/categorias/"+c).with(csrf())).andExpect(status().isNoContent());
        mvc.perform(get("/categorias/"+c)).andExpect(status().isNotFound());
    }
    @Test void registraReceitaEDespesaCom201ERetornaJson() throws Exception {
        long p=pessoa(true), c=categoria(); var body=lancamento(p,c);
        long id=criar("/lancamentos",body);
        mvc.perform(get("/lancamentos/"+id)).andExpect(jsonPath("$.valor").value(125.45)).andExpect(jsonPath("$.pessoa.id").value(p)).andExpect(jsonPath("$.categoria.id").value(c));
        body.put("tipo","RECEITA"); body.put("dataPagamento","2020-01-01");
        mvc.perform(put("/lancamentos/"+id).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isOk()).andExpect(jsonPath("$.tipo").value("RECEITA"));
        mvc.perform(delete("/lancamentos/"+id).with(csrf())).andExpect(status().isNoContent());
    }
    @Test void bloqueiaPessoaInativaEPreservaHistorico() throws Exception {
        long p=pessoa(true), c=categoria(); var body=lancamento(p,c); long id=criar("/lancamentos",body);
        mvc.perform(patch("/pessoas/"+p+"/ativo?valor=false").with(csrf())).andExpect(status().isOk());
        mvc.perform(post("/lancamentos").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isUnprocessableEntity());
        mvc.perform(put("/lancamentos/"+id).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isUnprocessableEntity());
        mvc.perform(get("/lancamentos")).andExpect(jsonPath("$.length()").value(1));
    }
    @Test void rejeitaVinculosInexistentes() throws Exception {
        long p=pessoa(true), c=categoria();
        mvc.perform(post("/lancamentos").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(lancamento(999999,c)))).andExpect(status().isNotFound());
        mvc.perform(post("/lancamentos").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(lancamento(p,999999)))).andExpect(status().isNotFound());
    }
    @Test void rejeitaValorNaoPositivoFracaoInvalidaEPagamentoFuturo() throws Exception {
        var body=lancamento(pessoa(true),categoria());
        for (double valor : new double[]{0,-1,0.001}) {
            body.put("valor",valor);
            mvc.perform(post("/lancamentos").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
        }
        body.put("valor",10); body.put("dataPagamento","2999-01-01");
        mvc.perform(post("/lancamentos").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
    }
    @Test void consultaComFiltrosCombinadosELimitesInclusivos() throws Exception {
        long p=pessoa(true), c=categoria(); criar("/lancamentos",lancamento(p,c));
        var other=lancamento(pessoa(true),c); other.put("dataVencimento","2026-12-01"); other.put("tipo","RECEITA"); criar("/lancamentos",other);
        mvc.perform(get("/lancamentos?inicio=2026-11-15&fim=2026-11-15&pessoaId="+p+"&categoriaId="+c+"&tipo=DESPESA")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1));
        mvc.perform(get("/lancamentos?inicio=2027-01-01")).andExpect(jsonPath("$.length()").value(0));
        mvc.perform(get("/lancamentos?inicio=2026-12-01&fim=2026-01-01")).andExpect(status().isBadRequest());
    }
    @Test void impedeExcluirCategoriaEmUso() throws Exception {
        long p=pessoa(true), c=categoria(); criar("/lancamentos",lancamento(p,c));
        mvc.perform(delete("/categorias/"+c).with(csrf())).andExpect(status().isConflict());
    }
    @Test void rejeitaJsonEEnumInvalidos() throws Exception {
        mvc.perform(post("/lancamentos").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"tipo\":\"OUTRO\"}")).andExpect(status().isBadRequest());
        mvc.perform(get("/lancamentos?inicio=data-invalida")).andExpect(status().isBadRequest());
    }
}
