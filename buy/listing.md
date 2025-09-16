---
title: "Buy Listing"
slug: "/buy/listing"
page_type: "listing"
brand: "iONexus"
---

# Buy Listing

## Mục tiêu
Danh sách BĐS để bán.

## Components
- Search bar + filters
- Sort dropdown
- Grid/List toggle
- Property cards

## Wireframe
[Search + Filters]
[Sort dropdown]
[Grid of Property Cards]
[Pagination]

pgsql
Sao chép mã

## Sample JSON
```json
{
  "items": [
    {"id":"p1","title":"Apartment in Marina","price":2000000,"beds":2,"sqft":1200}
  ]
}
yaml
Sao chép mã

---

## `buy/detail.md`
```markdown
---
title: "Buy Detail"
slug: "/buy/property/{id}"
page_type: "detail"
brand: "iONexus"
---

# Buy Detail

## Mục tiêu
Hiển thị chi tiết 1 bất động sản để mua.

## Layout
- Media carousel
- Title, price, specs
- Agent info
- Inquiry form (contact / WhatsApp)
- Related properties

## Sample JSON
```json
{
  "id":"p1",
  "title":"Apartment in Marina",
  "price":2000000,
  "beds":2,
  "baths":2,
  "sqft":1200,
  "location":"Dubai Marina"
}
yaml
Sao chép mã

---

## `rent/rent_overview.md`
```markdown
---
title: "Rent Overview"
slug: "/rent"
page_type: "overview"
brand: "iONexus"
---

# Rent Overview

## Mục tiêu
Trang landing con cho user quan tâm **thuê**.

## Layout
- Hero search (Rent tab active)
- Featured rentals
- Explore by Area
- Articles: "Rental guide"
