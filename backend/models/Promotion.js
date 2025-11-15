/**
 * Modelo de Promoción
 */
class Promotion {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.discount = data.discount;
    this.active = data.active;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.description = data.description;
    this.applicable_categories = data.applicable_categories;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  isActive() {
    return this.active;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      discount: this.discount,
      active: this.active,
      start_date: this.start_date,
      end_date: this.end_date,
      description: this.description,
      applicable_categories: this.applicable_categories,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Promotion;

