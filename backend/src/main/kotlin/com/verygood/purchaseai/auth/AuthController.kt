package com.verygood.purchaseai.auth

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

data class AuthRequest(@field:NotBlank val username: String, @field:NotBlank val password: String)
data class AuthResponse(val token: String)

@RestController
@RequestMapping("/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenUtil: JwtTokenUtil
) {
    @PostMapping("/register")
    fun register(@Valid @RequestBody req: AuthRequest): ResponseEntity<*> {
        if (userRepository.existsByUsername(req.username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(mapOf("error" to "Username already taken"))
        }
        val password = passwordEncoder.encode(req.password)
        requireNotNull(password)
        userRepository.save(User(username = req.username, password = password))
        return ResponseEntity.status(HttpStatus.CREATED).body(mapOf("message" to "User registered"))
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody req: AuthRequest): AuthResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(req.username, req.password)
        )
        return AuthResponse(jwtTokenUtil.generateToken(req.username))
    }
}
