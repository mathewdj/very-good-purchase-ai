package com.verygood.purchaseai.purchasetype

import com.verygood.purchaseai.purchase.PurchaseRepository
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

data class PurchaseTypeRequest(
    @field:NotBlank val name: String,
)

data class PurchaseTypeResponse(
    val id: Long,
    val name: String,
)

fun PurchaseType.toResponse() = PurchaseTypeResponse(id, name)

@RestController
@RequestMapping("/api/purchase-types")
class PurchaseTypeController(
    private val purchaseTypeRepository: PurchaseTypeRepository,
    private val purchaseRepository: PurchaseRepository,
) {
    @GetMapping
    fun list(): List<PurchaseTypeResponse> = purchaseTypeRepository.findAll().map { it.toResponse() }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @Valid @RequestBody req: PurchaseTypeRequest,
    ): PurchaseTypeResponse = purchaseTypeRepository.save(PurchaseType(name = req.name)).toResponse()

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody req: PurchaseTypeRequest,
    ): PurchaseTypeResponse {
        val existing =
            purchaseTypeRepository
                .findById(id)
                .orElseThrow { NoSuchElementException("PurchaseType $id not found") }
        return purchaseTypeRepository.save(existing.copy(name = req.name)).toResponse()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable id: Long,
    ): ResponseEntity<*> {
        if (!purchaseTypeRepository.existsById(id)) {
            return ResponseEntity.notFound().build<Unit>()
        }
        if (purchaseRepository.existsByPurchaseTypeId(id)) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(mapOf("error" to "Purchase type is in use and cannot be deleted"))
        }
        purchaseTypeRepository.deleteById(id)
        return ResponseEntity.noContent().build<Unit>()
    }
}
