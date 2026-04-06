package com.verygood.purchaseai.purchasetype

import jakarta.persistence.*

@Entity
@Table(name = "purchase_types")
data class PurchaseType(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @Column(unique = true, nullable = false)
    val name: String
)
