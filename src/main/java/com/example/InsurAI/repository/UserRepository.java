package com.example.InsurAI.repository;

import com.example.InsurAI.entity.User;
import com.example.InsurAI.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    long countByRoleAndEnabled(UserRole role, boolean enabled);

    List<User> findTop10ByOrderByCreatedAtDesc();

    List<User> findByRole(UserRole role);
}
