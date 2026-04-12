package com.verygood.purchaseai.purchase

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface PurchaseRepository : JpaRepository<Purchase, Long> {
    fun findAllByPurchaseTypeId(purchaseTypeId: Long): List<Purchase>

    fun existsByPurchaseTypeId(purchaseTypeId: Long): Boolean

    override fun findAll(pageable: Pageable): Page<Purchase>
}
