"""Load every docs/city-pages/*.md into the LOCAL database as an unpublished city page.

Usage (from atousservice-next/):  python docs/city-pages/load-drafts.py | docker exec -i atouts-postgres psql -U postgres -d atoutsservice
A page with the same slug is updated, but its `published` flag is never changed:
publishing is done by the owner from /admin/city-pages after review.
"""
import io
import pathlib

HERE = pathlib.Path(__file__).parent


def q(value: str) -> str:
    """Postgres dollar-quoted literal (safe for French text); empty -> NULL."""
    return "$q$" + value + "$q$" if value else "NULL"


for path in sorted(HERE.glob("*.md")):
    text = io.open(path, encoding="utf-8").read()
    _, front, body = text.split("---\n", 2)
    meta = {}
    for line in front.strip().splitlines():
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip().strip('"')
    cols = {
        "slug": meta["slug"],
        "city_name": meta["cityName"],
        "department": meta.get("department", ""),
        "postal_code": meta.get("postalCode", ""),
        "content": body.strip(),
        "hero_image_url": meta.get("heroImageUrl", ""),
        "meta_title": meta.get("metaTitle", ""),
        "meta_description": meta.get("metaDescription", ""),
    }
    names = ", ".join(cols)
    values = ", ".join(q(v) for v in cols.values())
    updates = ", ".join(f"{k} = excluded.{k}" for k in cols if k != "slug")
    print(
        f"insert into city_pages ({names}, published) values ({values}, false)\n"
        f"on conflict (slug) do update set {updates}, updated_at = now();"
    )
