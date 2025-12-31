package com.example.InsurAI.controller;

import com.example.InsurAI.dto.AuthResponse;
import com.example.InsurAI.dto.LoginRequest;
import com.example.InsurAI.dto.RegisterRequest;
import com.example.InsurAI.entity.User;
import com.example.InsurAI.security.JwtTokenProvider;
import com.example.InsurAI.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerCustomer(request);
            AuthResponse resp = new AuthResponse(
                    null,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userService.findByEmail(request.getEmail())
                .map(user -> {
                    if (user.getPasswordHash() == null ||
                            !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Invalid email or password");
                    }

                    String token = jwtTokenProvider.generateToken(
                            user.getId(), user.getEmail(), user.getRole().name()
                    );

                    AuthResponse resp = new AuthResponse(
                            token,
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole().name()
                    );
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password"));
    }

}
