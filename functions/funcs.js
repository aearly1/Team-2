function missinghrs(u) {
    let sum = 0
    let curr = new Date()
    let month = curr.getMonth()
    if(curr.getDate()>10)
    month++
    let max = new Date()
    max.setMonth(month,10)
    max.setHours(19)
    let min = new Date()
    min.setMonth(month-1,11)
    min.setHours(6)
    let att = u.attendance.filter(function(elem){
        let d = elem.time
        return elem.op == "sign out" && d.getTime()>min.getTime() && d.getTime() < max.getTime()
    })
    att.forEach(element => {
        sum+=element.net
    });
    let abs = Math.abs(sum)
    let mins = abs - Math.floor(Math.abs(sum)/60)*60
    return {Hours: Math.sign(sum)*Math.floor(Math.abs(sum)/60), Mins:Math.round(mins)*Math.sign(sum)}
}

function missingdays(u) {
    let dayoff = u.dayOff
    let today = new Date()
    let month = today.getMonth()
    if(today.getDate()>10)
    month++;
    let curr = new Date()
    let mont = curr.getMonth()
    if(curr.getDate()>10)
    mont++
    let max = new Date()
    max.setMonth(mont,10)
    max.setHours(19)
    let min = new Date()
    min.setMonth(mont-1,11)
    min.setHours(6)
    const missingdays= []
    let att = u.attendance.filter(function(elem){
        let d = elem.time
        return elem.op == "sign out" && d.getTime()>min.getTime() && d.getTime() < max.getTime() 
    })
    switch (u.dayOff) {
        case "SAT":
            dayoff=6
            break;
        case "SUN":
            dayoff=0
        case "MON":
            dayoff=1
            break;
        case "TUE":
            dayoff=2
            break;
        case "WED":
            dayoff=3
            break;
        case "THU":
            dayoff=4
            break;
        case "FRI":
            dayoff=5
            break;
    }
    for (let i = min; i.getTime() <= max.getTime(); i.setTime(i.getTime()+86400000)) {
        //let ds = new Date()
        //ds.setDate(i);
        if(dayoff==i.getDay())
            continue;
        if(i.getDay()==5)
            continue;
        let fil = att.filter(function(elem){
            return elem.time.getDate()==i.getDate()
        })
        if(fil.length==0)
        if(i.getTime()<=today.getTime())
        missingdays.push({Day: i.getDate(), Month: (i.getMonth()+1)}) 
    }
    return missingdays
}

module.exports.missinghours=missinghrs
module.exports.missingdays=missingdays