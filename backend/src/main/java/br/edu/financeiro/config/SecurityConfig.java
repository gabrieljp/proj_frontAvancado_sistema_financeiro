package br.edu.financeiro.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean UserDetailsService usuarios(@Value("${financeiro.usuario}") String usuario,@Value("${financeiro.senha}") String senha) {
        return new InMemoryUserDetailsManager(User.withUsername(usuario).password(new BCryptPasswordEncoder().encode(senha)).roles("OPERADOR").build());
    }
    @Bean BCryptPasswordEncoder encoder() { return new BCryptPasswordEncoder(); }
    @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(a->a.requestMatchers("/csrf","/login","/error").permitAll().anyRequest().authenticated())
            .formLogin(f->f.loginProcessingUrl("/login")
                .successHandler((req,res,auth)->{ res.setContentType("application/json"); res.getWriter().write("{\"authenticated\":true}"); })
                .failureHandler((req,res,e)->{ res.setStatus(401); res.setContentType("application/json"); res.getWriter().write("{\"message\":\"Usuario ou senha incorretos.\"}"); }))
            .logout(l->l.logoutUrl("/logout").logoutSuccessHandler((req,res,auth)->res.setStatus(204)))
            .exceptionHandling(e->e.authenticationEntryPoint((req,res,err)->{res.setStatus(401);res.setContentType("application/json");res.getWriter().write("{\"message\":\"Entre para continuar.\"}");})
                .accessDeniedHandler((req,res,err)->{res.setStatus(403);res.setContentType("application/json");res.getWriter().write("{\"message\":\"Sessao expirada. Atualize a pagina e tente novamente.\"}");}));
        return http.build();
    }
}
