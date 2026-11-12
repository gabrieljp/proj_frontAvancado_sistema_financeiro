package br.edu.financeiro.web;

import java.security.Principal;
import java.util.Map;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    @GetMapping("/csrf") public Map<String,String> csrf(CsrfToken token) { return Map.of("token",token.getToken(),"headerName",token.getHeaderName()); }
    @GetMapping("/sessao") public Map<String,String> sessao(Principal principal) { return Map.of("usuario",principal.getName()); }
}
