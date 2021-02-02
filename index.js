const Handlebars = require('handlebars');
const fs = require('fs-extra');
const parse = require('csv-parse/lib/sync');

const missionIdeasTemplate = fs.readFileSync('./templates/mission-ideas.html').toString();
const compiledMissionIdeasTemplate = Handlebars.compile(missionIdeasTemplate);

let rawData = fs.readFileSync('./mission-cats.csv', 'utf8');
let records = parse(rawData, {
  skip_empty_lines: true
});
records.shift(); // get ride of column data

/* ABSTRACT TAGS */
// get hrefs and colors
let colorArray = ["#f5acb0", "#e7abf5","#b2a6f5","#abc9f6","#acf5ea","#adf6ac","#caf5ac", "#f5f1a7","#f5caab","#f5acb0", "#e7abf5","#b2a6f5","#abc9f6","#acf5ea","#adf6ac","#caf5ac", "#f5f1a7","#f5caab"];
let allTagsA = [];
for (let record of records) {
    let tagsAbstract = record[2].split(',');
    for (let ta of tagsAbstract) {
        if (allTagsA.indexOf(ta) === -1) {
            allTagsA.push(ta);
        }
    }
}
let tagAbstractHrefMap = allTagsA.sort().reduce((acc, curr) => {
    acc[curr] = {
        href: curr.toLowerCase().replace(/-/g, '').replace(/\s/g, '_'),
        color: colorArray.pop()
    };
    return acc;
}, {});


let tagDataByTag = {};

for (let record of records) {
    //console.log(record);
    let tagsAbstract = record[2].split(',').sort();
    let isCurrentMission = record[1] === 'checked';

    for (let tag of tagsAbstract) {

        if (!tagDataByTag[tag]) {
            tagDataByTag[tag] = {
                tag_title: tag,
                tag_url_frag: tagAbstractHrefMap[tag].href,
                idea_count: 0,
                ideas: []
            };
        }

        tagDataByTag[tag].idea_count++;
        let idea =  {
            idea: Object.values(record)[0],
            idea_tags_abstract: tagsAbstract.map(t => {
                return {
                    tag: t,
                    tag_url_frag: tagAbstractHrefMap[t].href,
                    tag_color: tagAbstractHrefMap[t].color
                };
            }),
            current_mission: isCurrentMission
        };

        tagDataByTag[tag].ideas.push(idea);
    }
}

// Do the sorting of the ideas by tag...?
let tagsAbstract = Object.values(tagDataByTag).sort((a, b) => (a.idea_count < b.idea_count) ? 1 : -1);
for (let tagData of tagsAbstract) {
    tagData.ideas.sort((a,b) => {
        const aTag1 = a.idea_tags_abstract[0].tag;
        const aTag2 = a.idea_tags_abstract[1] ? a.idea_tags_abstract[1].tag : undefined;
        const bTag1 = b.idea_tags_abstract[0].tag;
        const bTag2 = b.idea_tags_abstract[1] ? b.idea_tags_abstract[1].tag : undefined;

        if (aTag1 === bTag1) {
            if (aTag2 < bTag2) {
                return -1;
            }
            if (aTag2 > bTag2) {
                return 1;
            }
        }

        if (aTag1 < bTag1) {
            return -1;
        }
        if (aTag1 > bTag1) {
            return 1;
        }

        return 0;
    });
}

/* CONCRETE TAGS */

// get hrefs and colors
colorArray = ["#f5acb0", "#e7abf5","#b2a6f5","#abc9f6","#acf5ea","#adf6ac","#caf5ac", "#f5f1a7","#f5caab","#f5acb0", "#e7abf5","#b2a6f5","#abc9f6","#acf5ea","#adf6ac","#caf5ac", "#f5f1a7","#f5caab", "#f5acb0", "#e7abf5","#b2a6f5","#abc9f6","#acf5ea","#adf6ac","#caf5ac", "#f5f1a7","#f5caab","#f5acb0", "#e7abf5","#b2a6f5","#abc9f6","#acf5ea","#adf6ac","#caf5ac", "#f5f1a7","#f5caab"];
let allTagsC = [];
for (let record of records) {
    let tagsConcrete = record[3].split(',');
    for (let ta of tagsConcrete) {
        if (allTagsC.indexOf(ta) === -1) {
            allTagsC.push(ta);
        }
    }
}
let tagConcreteHrefMap = allTagsC.sort().reduce((acc, curr) => {
    acc[curr] = {
        href: curr.toLowerCase().replace(/-/g, '').replace(/\s/g, '_'),
        color: colorArray.pop()
    };
    return acc;
}, {});


let tagConcreteDataByTag = {};

for (let record of records) {
    //console.log(record);
    let tagsConcrete = record[3].split(',').sort();
    let isCurrentMission = record[1] === 'checked';

    for (let tag of tagsConcrete) {
        if (tag === '') { continue; }

        if (!tagConcreteDataByTag[tag]) {
            tagConcreteDataByTag[tag] = {
                tag_title: tag,
                tag_url_frag: tagConcreteHrefMap[tag].href,
                idea_count: 0,
                ideas: []
            };
        }

        tagConcreteDataByTag[tag].idea_count++;
        let idea =  {
            idea: Object.values(record)[0],
            idea_tags_concrete: tagsConcrete.map(t => {
                return {
                    tag: t,
                    tag_url_frag: tagConcreteHrefMap[t].href,
                    tag_color: tagConcreteHrefMap[t].color
                };
            }),
            current_mission: isCurrentMission
        };

        tagConcreteDataByTag[tag].ideas.push(idea);
    }
}

// Do the sorting of the ideas by tag...?
let tagsConcrete = Object.values(tagConcreteDataByTag).sort((a, b) => (a.idea_count < b.idea_count) ? 1 : -1);
for (let tagData of tagsConcrete) {
    tagData.ideas.sort((a,b) => {
        const aTag1 = a.idea_tags_concrete[0].tag;
        const aTag2 = a.idea_tags_concrete[1] ? a.idea_tags_concrete[1].tag : undefined;
        const aTag3 = a.idea_tags_concrete[2] ? a.idea_tags_concrete[2].tag : undefined;
        const bTag1 = b.idea_tags_concrete[0].tag;
        const bTag2 = b.idea_tags_concrete[1] ? b.idea_tags_concrete[1].tag : undefined;
        const bTag3 = b.idea_tags_concrete[2] ? b.idea_tags_concrete[2].tag : undefined;

        if (aTag1 === bTag1) {
            if (aTag2 === bTag2) {
                if (aTag3 < bTag3) {
                    return -1;
                }
                if (aTag3 > bTag3) {
                    return 1;
                }
            }

            if (aTag2 < bTag2) {
                return -1;
            }
            if (aTag2 > bTag2) {
                return 1;
            }
        }

        if (aTag1 < bTag1) {
            return -1;
        }
        if (aTag1 > bTag1) {
            return 1;
        }

        return 0;
    });
}


const data = {
    tags_abstract: tagsAbstract,
    tags_concrete: tagsConcrete,
}

fs.writeFileSync('./index.html', compiledMissionIdeasTemplate(data));
