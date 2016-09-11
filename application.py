from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask import render_template, redirect, url_for, request, flash
from hash_url import UrlHash
# from flask import json
import json
import urllib2
from BeautifulSoup import BeautifulSoup

app = Flask(__name__)

config = Config()
app.config['SQLALCHEMY_DATABASE_URI'] = config.get_db_url()

db = SQLAlchemy(app)

# defined by me
app.domain = "http://localhost:5000/"

class UrlDB(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    long_url = db.Column(db.String(5000), nullable=False)

    def __init__(self, long_url):
        self.long_url = long_url

    def __repr__(self):
        return '<User %r>' % self.short_url


@app.route('/')
def index():
    # db.create_all()
    # return redirect("http://www.google.com", code=302)
    # return render_template('add_link.html', name=name)
    return render_template('add_link.html')


@app.route('/post_link', methods=['POST'])
def post_link():

    long_url = request.form['long_link']
    long_url = long_url.strip("http://").strip("https://")

    try:
        soup = BeautifulSoup(urllib2.urlopen("http://" + long_url))
        title = soup.title.string
        print "Exists!"
    except:
        print 'Invalid URL!'
        flash("error")
        return redirect(url_for('index'))

    db_entry = UrlDB(long_url=long_url)
    db.session.add(db_entry)
    db.session.commit()

    db_id = db_entry.id
    print 'DB id', db_id

    short_url = UrlHash.get_base_k(db_id)
    print 'short_url', short_url

    # return redirect(url_for('display_result', link=short_url))
    # data = {'long_url': long_url, 'short_url': short_url}
    data = {'long_url': long_url, 'title': title, 'short_url': app.domain + 'r/' + short_url}
    flash(json.dumps(data))
    return redirect(url_for('index'))


@app.route('/result')
def display_result():
    return render_template('add_link.html', short_url=request.args['link'])
    # return render_template('add_link.html', short_url=res)


@app.route('/r/<short_url>')
def short_to_long_url(short_url):
    db_id = UrlHash.get_base_10(short_url)
    obj = UrlDB.query.get(db_id)
    print obj.long_url
    return redirect("http://" + obj.long_url, code=302)

if __name__ == '__main__':
    app.secret_key = 'private key'

    app.run(debug=True, threaded=True)
