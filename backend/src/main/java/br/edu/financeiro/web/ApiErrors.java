package br.edu.financeiro.web;

import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.dao.DataIntegrityViolationException;

@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<?> regra(ResponseStatusException e) { return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason() == null ? "Operação inválida." : e.getReason())); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> validacao(MethodArgumentNotValidException e) {
        var erros=e.getBindingResult().getFieldErrors().stream().map(f->f.getField()+": "+f.getDefaultMessage()).toList();
        return ResponseEntity.badRequest().body(Map.of("message","Confira os campos informados.","errors",erros));
    }
    @ExceptionHandler({HttpMessageNotReadableException.class,MethodArgumentTypeMismatchException.class})
    ResponseEntity<?> formato(Exception e) { return ResponseEntity.badRequest().body(Map.of("message","Dados inválidos. Confira valores, datas e campos obrigatórios.")); }
    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<?> integridade(DataIntegrityViolationException e) { return ResponseEntity.status(409).body(Map.of("message","Registro duplicado ou vinculado a outro cadastro.")); }
}
