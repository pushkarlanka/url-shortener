from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://pushkar:!lvdatabases@flask-db.cydhh6wmxzpc.us-west-2.rds.amazonaws.com:3306/flaskdb'

app.debug = True
db = SQLAlchemy(app)


class UrlTable(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    short_url = db.Column(db.String(45), unique=True, nullable=False)
    long_url = db.Column(db.String(5000), nullable=False)

    def __init__(self, short_url, long_url):
        self.short_url = short_url
        self.long_url = long_url

    def __repr__(self):
        return '<User %r>' % self.short_url


@app.route('/')
def hello_world():
    db.create_all()
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
