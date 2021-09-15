---
title: "Data modeling"
date: 2021-09-15T13:35:32-04:00
draft: false
weight: 30
---

{{< mermaid >}}
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
{{< /mermaid >}}
