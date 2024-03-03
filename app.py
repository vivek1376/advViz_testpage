from flask import Flask, render_template, send_file
# from livereload import Server


app = Flask(__name__)

@app.route('/')
def home():
    # return "Hello, World!"
    return render_template('index.html')
    # return "hello"


@app.route('/getcsvdata', methods=['GET'])
def get_data():
    return send_file('data/snowplow-2021-02-15_2021-02-21_filtered.csv', mimetype='text/csv')


if __name__ == '__main__':
    app.run(debug=True)
    # server = Server(app.wsgi_app)
    # server.serve()