package com.placementtracker.backend.controllers;

import com.placementtracker.backend.models.User;
import com.placementtracker.backend.repositories.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordHash(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (request.getName() != null && !request.getName().isEmpty()) {
                user.setName(request.getName());
            }
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                user.setEmail(request.getEmail());
            }
            userRepository.save(user);
            return ResponseEntity.ok("Profile updated successfully");
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    @PatchMapping("/password")
    public ResponseEntity<?> updatePassword(Authentication authentication, @RequestBody UpdatePasswordRequest request) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (encoder.matches(request.getOldPassword(), user.getPasswordHash())) {
                user.setPasswordHash(encoder.encode(request.getNewPassword()));
                userRepository.save(user);
                return ResponseEntity.ok("Password updated successfully");
            } else {
                return ResponseEntity.badRequest().body("Incorrect old password");
            }
        }
        return ResponseEntity.badRequest().body("User not found");
    }
}

@Data
class UpdateProfileRequest {
    private String name;
    private String email;
}

@Data
class UpdatePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
