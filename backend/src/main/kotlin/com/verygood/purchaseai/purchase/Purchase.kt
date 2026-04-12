package com.verygood.purchaseai.purchase

import com.verygood.purchaseai.purchasetype.PurchaseType
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate

@Entity
@Table(name = "purchases")
data class Purchase(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @Column(nullable = false)
    val date: LocalDate,
    @Column(nullable = false, length = 500)
    val description: String,
    @Column(nullable = false, precision = 19, scale = 2)
    val amount: BigDecimal,
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "purchase_type_id", nullable = false)
    val purchaseType: PurchaseType,
)
