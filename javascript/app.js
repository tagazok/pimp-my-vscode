fetchData();

function fetchData() {
    return fetch('/data/data.json')
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            data.roadshows.forEach(roadshow => {
                const rs = new Roadshow(roadshow);
                rs.display();
            })
        });
}

// Talk
function Talk(data) {
    this.title = data.title;
    this.speakers = data.speakers || [];
}

Talk.prototype.toHtml = function() {
    return `
        ${this.title} • <span class="speakers">(${this.speakers.join(', ')})</span>
    `;
}


// Activity
function Activity(data) {
    this.host = data.host;
    this.talks = [];
    data.talks.forEach(talk => {
        this.addTalk(talk);
    });
}

Activity.prototype.addTalk = function(talk) {
    this.talks.push(new Talk(talk));
}

Activity.prototype.toHtml = function() {
    let html =
        `<div class="activity">
            <div class="host">${this.host}</div><ul>`;
    this.talks.forEach(talk => {
        html += talk.toHtml();
    })
    html += '</ul></div>';
    return html;
}


// RoadshowStop
function RoadshowStop(data) {
    this.date = data.date;
    this.city = data.city;
    this.activities = [];
    data.activities.forEach(activity => {
        this.addActivity(activity);
    });
}

RoadshowStop.prototype.addActivity = function(activity) {
    this.activities.push(new Activity(activity));
}

RoadshowStop.prototype.toHtml = function() {
    let html = `
        <li class="roadshow-stop">
            <h6 class="infos card-subtitle mb-2 text-muted">${this.city} - ${this.date}</h6>
    `;
    this.activities.forEach(activity => {
        html += activity.toHtml();
    });
    this.html += '</li>';
    return html;
}


// Roadshow
function Roadshow(data) {
    this.title = data.title;
    this.stops = [];
    data.stops.forEach(stop => {
        this.addStop(stop);
    });
}

Roadshow.prototype.addStop = function(stop) {
    this.stops.push(new RoadshowStop(stop));
}

Roadshow.prototype.display = function() {
    const selector = document.querySelector("#roadshow");
    selector.insertBefore(this.generateTemplate(), selector.firstChild);
}

Roadshow.prototype.generateTemplate = function() {
    const tmpl = `
            <h2 class="roadshow-title">${this.title}</h2>
            ${this.displayStops()}
        `;
    const range = document.createRange();
    const fragment = range.createContextualFragment(tmpl);
    return fragment;
}

Roadshow.prototype.displayStops = function() {
    let html = '<ul class="roadshow-activities">';
    this.stops.forEach(stop => {
        html += `${stop.toHtml()}`;
    });
    html += '</ul>';
    return html;
}