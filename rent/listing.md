---
title: "Rent Listing"
slug: "/rent/listing"
page_type: "listing"
brand: "iONexus"
---

# Rent Listing

## Mục tiêu
Danh sách BĐS cho thuê.

## Components
- Search bar + filters
- Rent price per month
- Property cards

## Sample JSON
```json
{"items":[{"id":"r1","title":"1BR Downtown","rent":8000,"currency":"AED"}]}
yaml
Sao chép mã

---

## `rent/detail.md`
```markdown
---
title: "Rent Detail"
slug: "/rent/property/{id}"
page_type: "detail"
brand: "iONexus"
---

# Rent Detail

## Layout
- Media carousel
- Price/month
- Specs
- Contact form