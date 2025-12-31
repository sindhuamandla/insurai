package com.example.InsurAI.service;

import com.example.InsurAI.entity.User;
import com.example.InsurAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import com.example.InsurAI.entity.UserRole;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oauth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oauth2User.getAttributes();

        if (!"google".equals(registrationId)) {
            throw new OAuth2AuthenticationException("Unsupported OAuth provider: " + registrationId);
        }

        String provider = "google";
        String providerId = attributes.get("sub").toString();
        String email = attributes.getOrDefault("email", "").toString();
        String displayName = attributes.getOrDefault("name", "").toString();

        if (email == null || email.isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from Google provider");
        }

        String name = !displayName.isEmpty() ? displayName : email;

        Optional<User> existing =
                userRepository.findByProviderAndProviderId(provider, providerId);

        User user = existing.orElseGet(User::new);

        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setEmail(email);
        user.setName(name);

        if (user.getRole() == null) {
            user.setRole(UserRole.CUSTOMER);
        }

        // Don't touch passwordHash (stays null for OAuth-only accounts)

        System.out.println("Saving Google user: " + user.getEmail());
        userRepository.save(user);

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole())),
                attributes,
                "sub"
        );
    }
}
