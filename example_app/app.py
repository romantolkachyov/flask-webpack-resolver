# -*- coding: utf-8 -*-
from flask import Flask

from appmod import simple_page

app = Flask(__name__)

app.register_blueprint(simple_page, url_prefix='/pages')


def init_app():
    return app


@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()
