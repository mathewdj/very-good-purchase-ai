package com.verygood.purchaseai.purchase

import com.verygood.purchaseai.purchasetype.PurchaseTypeRepository
import com.verygood.purchaseai.purchasetype.PurchaseTypeResponse
import com.verygood.purchaseai.purchasetype.toResponse
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.time.LocalDate

data class PurchaseRequest(
    @field:NotNull val date: LocalDate,
    @field:NotBlank val description: String,
    @field:NotNull @field:Positive val amount: BigDecimal,
    @field:NotNull val purchaseTypeId: Long,
)

data class PurchaseResponse(
    val id: Long,
    val date: LocalDate,
    val description: String,
    val amount: BigDecimal,
    val purchaseType: PurchaseTypeResponse,
)

fun Purchase.toResponse() = PurchaseResponse(id, date, description, amount, purchaseType.toResponse())

@RestController
@RequestMapping("/api/purchases")
class PurchaseController(
    private val purchaseRepository: PurchaseRepository,
    private val purchaseTypeRepository: PurchaseTypeRepository,
) {
    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): Page<PurchaseResponse> =
        purchaseRepository
            .findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date")))
            .map { it.toResponse() }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @Valid @RequestBody req: PurchaseRequest,
    ): PurchaseResponse {
        val purchaseType =
            purchaseTypeRepository
                .findById(req.purchaseTypeId)
                .orElseThrow { NoSuchElementException("PurchaseType ${req.purchaseTypeId} not found") }
        return purchaseRepository
            .save(
                Purchase(date = req.date, description = req.description, amount = req.amount, purchaseType = purchaseType),
            ).toResponse()
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody req: PurchaseRequest,
    ): PurchaseResponse {
        val existing =
            purchaseRepository
                .findById(id)
                .orElseThrow { NoSuchElementException("Purchase $id not found") }
        val purchaseType =
            purchaseTypeRepository
                .findById(req.purchaseTypeId)
                .orElseThrow { NoSuchElementException("PurchaseType ${req.purchaseTypeId} not found") }
        return purchaseRepository
            .save(
                existing.copy(date = req.date, description = req.description, amount = req.amount, purchaseType = purchaseType),
            ).toResponse()
    }

    @DeleteMapping("/{id}")
    fun delete(
        @PathVariable id: Long,
    ): ResponseEntity<Unit> {
        if (!purchaseRepository.existsById(id)) return ResponseEntity.notFound().build()
        purchaseRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}
