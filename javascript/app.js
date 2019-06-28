fetchData();

async function fetchData() {
    const response = await fetch('/data/data2.json');
    const data = await response.json();
    data.roadshows.forEach(roadshow => {
        const rs = new Roadshow(roadshow);
        rs.display();
    });
}

// Talk
class Talk {
    constructor(data) {
        this.title = data.title;
        this.speakers = data.speakers || [];
    }
    toHtml() {
        return `
    <div>- ${this.title} • <span class="speakers">(${this.speakers.join(', ')})</span></div>
    `;
    }
}



// Activity
class Activity {
    constructor(data) {
        this.host = data.host;
        this.talks = [];
        data.talks.forEach(talk => {
            this.addTalk(talk);
        });
    }
    addTalk(talk) {
        this.talks.push(new Talk(talk));
    }
    toHtml() {
        let html = `<div class="activity">
            <div class="host">${this.host}</div><ul>`;
        this.talks.forEach(talk => {
            html += talk.toHtml();
        });
        html += '</ul></div>';
        return html;
    }
}




// RoadshowStop
class RoadshowStop {
    constructor(data) {
        this.date = data.date;
        this.city = data.city;
        this.activities = [];
        data.activities.forEach(activity => {
            this.addActivity(activity);
        });
    }
    addActivity(activity) {
        this.activities.push(new Activity(activity));
    }
    toHtml() {
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
}




// Roadshow
class Roadshow {
    constructor(data) {
        this.title = data.title;
        this.stops = [];
        data.stops.forEach(stop => {
            this.addStop(stop);
        });
    }
    addStop(stop) {
        this.stops.push(new RoadshowStop(stop));
    }
    display() {
        const selector = document.querySelector("#roadshow");
        selector.insertBefore(this.generateTemplate(), selector.firstChild);
    }
    generateTemplate() {
        const tmpl = `
            <h2 class="roadshow-title">${this.title}</h2>
            ${this.displayStops()}
        `;
        const range = document.createRange();
        const fragment = range.createContextualFragment(tmpl);
        return fragment;
    }
    displayStops() {
        let html = '<ul class="roadshow-activities">';
        this.stops.forEach(stop => {
            html += `${stop.toHtml()}`;
        });
        html += '</ul>';
        return html;
    }
}




