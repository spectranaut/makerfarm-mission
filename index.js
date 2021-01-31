const Handlebars = require('handlebars');
const fs = require('fs-extra');
const parse = require('csv-parse/lib/sync');

const missionIdeasTemplate = fs.readFileSync('./templates/mission-ideas.html').toString();
const compiledMissionIdeasTemplate = Handlebars.compile(missionIdeasTemplate);

let rawData = fs.readFileSync('./mission-cats.csv').toString();
let records = parse(rawData, {
  columns: true,
  skip_empty_lines: true
});

let ideasByTag = {};

for (let record of records) {
    let tags = record['Topics'].split(',');

    let tagHrefMap = tags.reduce((acc, curr) => {
        acc[curr] = curr.toLowerCase().replace(/-/g, '').replace(/\s/g, '_');
        return acc;
    }, {});

    for (let tag of tags) {

        if (!ideasByTag[tag]) {
            ideasByTag[tag] = {
                tag_title: tag,
                tag_url_frag: tagHrefMap[tag],
                idea_count: 0,
                ideas: []
            };
        }

        ideasByTag[tag].idea_count++;
        ideasByTag[tag].ideas.push({
            idea: Object.values(record)[0],
            idea_tags: tags.map(t => {
                return {
                    tag: t,
                    tag_url_frag: tagHrefMap[t]
                };
            })
        });
    }
}

const data = {
    tags: Object.values(ideasByTag)
}

fs.writeFileSync('./index.html', compiledMissionIdeasTemplate(data));
