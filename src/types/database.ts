/* Database Entity Types */

export interface BaseEntity {
  id: number
  created_at?: string
  updated_at?: string
}

// Add entity types during migration
// Example:
// export interface Producto extends BaseEntity {
//   nombre: string
//   precio_venta: number
//   ...
// }
