"""Load every docs/blog/*.md article into the LOCAL database as an unpublished draft.

Usage (from atousservice-next/):  python docs/blog/load-drafts.py | docker exec -i atouts-postgres psql -U postgres -d atoutsservice
An existing article with the same slug is updated, but its `published` flag is never changed:
publishing is done by the owner from /admin/blog after review.
"""
import io
import pathlib

HERE = pathlib.Path(__file__).parent


def q(value: str) -> str:
    """Postgres dollar-quoted literal (safe for apostrophes and quotes in French text); empty -> NULL."""
    return "$q$" + value + "$q$" if value else "NULL"


for path in sorted(HERE.glob("*.md")):
    text = io.open(path, encoding="utf-8").read()
    _, front, body = text.split("---\n", 2)
    meta = {}
    for line in front.strip().splitlines():
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip().strip('"')
    tags = ",".join(t.strip() for t in meta["tags"].strip("[]").split(","))
    cols = {
        "title": meta["title"],
        "slug": meta["slug"],
        "excerpt": meta["excerpt"],
        "content": body.strip(),
        "cover_image_url": meta["coverImageUrl"],
        "category": meta["category"],
        "tags": tags,
        "meta_title": meta["metaTitle"],
        "meta_description": meta["metaDescription"],
        # Publication date shown on the site (Europe/Paris). The admin keeps it when the post is published.
        "published_at": meta.get("publishedAt", ""),
    }
    names = ", ".join(cols)
    values = ", ".join(q(v) for v in cols.values())
    updates = ", ".join(f"{k} = excluded.{k}" for k in cols if k != "slug")
    print(
        f"insert into blog_posts ({names}, author, published) values ({values}, 'Atouts Services', false)\n"
        f"on conflict (slug) do update set {updates}, updated_at = now();"
    )
