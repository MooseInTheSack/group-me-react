const rawData = require('./00001/59528655/message.json')
const groupMemberData = require('./00001/59528655/conversation.json')

const getGroupMembers = () => {
    //get all groupParticipants with their name and ID's
    //return JSON.parse(groupMemberData)
    return groupMemberData
}

const getConversation = () => {
    //return JSON.parse(rawData)
    return rawData
}

const getDictionaryOfIdsToNames = () => {
    const dict = getGroupMembers()
    const membersArray = dict['members']
    const idNameDict = {}
    for(let personObject of membersArray) {
        const user_id = personObject['user_id']
        const user_name = personObject['nickname']
        idNameDict[user_id] = user_name
    }
    return idNameDict
}

const convertIdsToNames = (arrayOfArrays) => {
    //console.log('arrayOfArrays: ', arrayOfArrays)
    const topMembers = arrayOfArrays
    const TopTenDictWithNames = {}
    const dictOfIdsToNames = getDictionaryOfIdsToNames()
    for(let member of topMembers) {
        const memberName = dictOfIdsToNames[member[0]]
        TopTenDictWithNames[memberName] = member[1]
    }
    return TopTenDictWithNames
}

const getMostActiveMembersFromDict = (dict, numberOfEntries) => {
    let topTenArray = []
    

    for (var user_id in dict) {
        topTenArray.push([user_id, dict[user_id]]);
    }

    topTenArray = topTenArray.sort(function(a, b) {
        return a[1] - b[1];
    })

    topTenArray = topTenArray.splice(topTenArray.length - numberOfEntries, numberOfEntries)

    const sortedMostActiveMembers = convertIdsToNames(topTenArray)
    return sortedMostActiveMembers

}
// eslint-disable-next-line
const printMostActiveMembers = (numberOfEntries) => {
    const conv = getConversation()
    let dict = {}
    for(let message of conv) {
        const sender_id = message['sender_id']
        if(dict[sender_id] === undefined) {
            dict[sender_id] = 1
        } else {
            dict[sender_id] += 1
        }
    }

    return getMostActiveMembersFromDict(dict, numberOfEntries)
    
}

const generateNamesAndScoreArray = (likesThreshold) => {
    
    const dict = getConversation()

    const dictOfIds = getDictionaryOfIdsToNames()

    let mostLikedMessages = {}
    let totalMessagesCount = {}
    let totalLikesCount = {}

    //console.log('dict: ', dict[0])
    for(let message of dict) {
        //console.log('message: ', message)

        if(message.sender_id) {
            const senderName = dictOfIds[message.sender_id]

            if(!totalMessagesCount[senderName])
                totalMessagesCount[senderName] = 0
            totalMessagesCount[senderName] += 1

            if(!totalLikesCount[senderName])
                totalLikesCount[senderName] = 0

            if(message.favorited_by && message.favorited_by.length) {
                totalLikesCount[senderName] += message.favorited_by.length
            }
        }        

        if(message.favorited_by && message.favorited_by.length > likesThreshold) {
            
            const senderName = dictOfIds[message.sender_id]
            
            if(!mostLikedMessages[senderName])
                mostLikedMessages[senderName] = []
            if(message.text) {
                //console.log('message: ', message.text)
                mostLikedMessages[senderName].push(message.text)
            } else if(message.attachments && message.attachments[0] && message.attachments[0].url ) {
                //console.log('attachments: ', message.attachments)
                mostLikedMessages[senderName].push(message.attachments[0].url)
            }
        }
    }
    //console.log('mostLikedMessages: ', mostLikedMessages)

    const namesToTopMessages = {}
    var namesAndScoreArray = []

    for(let name of Object.keys(mostLikedMessages)) {
        namesToTopMessages[name] = { 
            topMessages: mostLikedMessages[name].length,
            topMessageThreshold: likesThreshold,
            totalMessages: totalMessagesCount[name],
            percentOfMessagesThatMetThreshold: mostLikedMessages[name].length/totalMessagesCount[name]
        }
        namesAndScoreArray.push({
            name: name,
            topMessages: mostLikedMessages[name].length,
            topMessageThreshold: likesThreshold,
            totalMessages: totalMessagesCount[name],
            totalLikes: totalLikesCount[name],
            percentOfMessagesThatMetThreshold: mostLikedMessages[name].length/totalMessagesCount[name]
        })
    }    

    return namesAndScoreArray
}

 function getTopMessagersByThreshold(numberToRetrieve, likesThreshold) {
    //sort by topMessage count
    const namesAndScoreArray = generateNamesAndScoreArray(likesThreshold)
    return namesAndScoreArray.sort(function (a, b) {
        return b.topMessages - a.topMessages;
    }).slice(0,numberToRetrieve);
}

 function getTopMessagersByPercent(numberToRetrieve, likesThreshold) {
    //sort by topMessage percent
    const namesAndScoreArray = generateNamesAndScoreArray(likesThreshold)
    return namesAndScoreArray.sort(function (a, b) {
        return b.percentOfMessagesThatMetThreshold - a.percentOfMessagesThatMetThreshold;
    }).slice(0,numberToRetrieve);
}

 function getTopMessagersByTotalLikes(numberToRetrieve, likesThreshold) {
    //sort by topMessage percent
    const namesAndScoreArray = generateNamesAndScoreArray(0)
    return namesAndScoreArray.sort(function (a, b) {
        return b.totalLikes - a.totalLikes;
    }).slice(0,numberToRetrieve);
}

 function getTopMessagersByTotalMessages(numberToRetrieve, likesThreshold) {
    //sort by topMessage percent
    const namesAndScoreArray = generateNamesAndScoreArray(0)
    return namesAndScoreArray.sort(function (a, b) {
        return b.totalMessages - a.totalMessages;
    }).slice(0,numberToRetrieve);
}

 function getTopMessagersBySentLikes() {
    const conv = getConversation();
    const dictOfIds = getDictionaryOfIdsToNames()

    console.log('conv: ', conv)

}