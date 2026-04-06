package com.verygood.purchaseai.auth

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtTokenUtil(
    @Value("\${app.jwt.secret}") private val secret: String,
    @Value("\${app.jwt.expiration-ms}") private val expirationMs: Long
) {
    private val key: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateToken(username: String): String = Jwts.builder()
        .subject(username)
        .issuedAt(Date())
        .expiration(Date(System.currentTimeMillis() + expirationMs))
        .signWith(key)
        .compact()

    fun getUsernameFromToken(token: String): String =
        Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token).payload.subject

    fun validateToken(token: String): Boolean = runCatching {
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token)
        true
    }.getOrDefault(false)
}
