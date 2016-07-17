from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask import render_template, redirect, url_for, request

app = Flask(__name__)

config = Config()
app.config['SQLALCHEMY_DATABASE_URI'] = config.get_db_url()

app.debug = True
db = SQLAlchemy(app)


class UrlMap(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    short_url = db.Column(db.String(45), unique=True, nullable=False)
    long_url = db.Column(db.String(5000), nullable=False)

    def __init__(self, short_url, long_url):
        self.short_url = short_url
        self.long_url = long_url

    def __repr__(self):
        return '<User %r>' % self.short_url


@app.route('/')
def index():
    db.create_all()
    # return redirect("http://www.google.com", code=302)
    # return 'Hello World!'
    # return render_template('add_link.html', name=name)
    return render_template('add_link.html')


@app.route('/post_link', methods=['POST'])
def post_link():
    urlmap = UrlMap(short_url='DD', long_url=request.form['long_link'])
    db.session.add(urlmap)
    db.session.commit()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run()
