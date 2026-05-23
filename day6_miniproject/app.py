from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from api_service import get_country_data
from ai_helper import ask_ai

app = FastAPI(
    title="Country Intelligence Dashboard",
    description="Enterprise Country Analytics Platform",
    version="2.0.0"
)

# Static files
app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

# Templates
templates = Jinja2Templates(
    directory="templates"
)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "country": None,
            "ai_data": None
        }
    )


@app.post("/", response_class=HTMLResponse)
async def search_country(
    request: Request,
    country: str = Form(...)
):

    country = country.strip()

    country_data = get_country_data(country)

    ai_data = None

    if country_data:

        ai_data = ask_ai(
            country_data.name
        )

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "country": country_data,
            "ai_data": ai_data
        }
    )