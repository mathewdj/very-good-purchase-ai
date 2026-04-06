package com.verygood.purchaseai.auth

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class AppUserDetailsService(private val userRepository: UserRepository) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails =
        userRepository.findByUsername(username)
            .map { user ->
                org.springframework.security.core.userdetails.User(
                    user.username, user.password, emptyList()
                )
            }
            .orElseThrow { UsernameNotFoundException("User not found: $username") }
}
