const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.createMethotar = functions.https.onRequest( async (req, res) => {
    const data = req.query; 
    const userID = data.userID;
    const firstName = data.firstName;
    const lastName = data.lastName;
    const jobDescription = data.jobDescription;
    const bio = data.bio;
    
    console.log(userID);
    const docRef = await db.collection('methotar').doc(userID);
    await docRef.set({
        'firstName': firstName,
        'lastName': lastName,
        'jobDescription': jobDescription,
        'bio': bio,
    });

    return res.send('completed');
});

exports.createPastProjects = functions.https.onRequest( async (req, res) => {
    const data = req.query; 
    const client = data.client
    const clientID = data.clientID
    const dateStarted = data.dateStarted;
    const dateEnded = data.dateEnded;
    const description = data.description;
    
    const teamRef = db.collection("team");
    const team = JSON.parse(data.team);
    try {
        const docRef = await db.collection('pastprojects').doc();
        await docRef.set({
            'clientID': clientID,
            'dateStarted': dateStarted,
            'dateEnded': dateEnded,
            'description': description,
            'team': team
        });
    
        // for (let index in team){
        //     const docID = team[index].methotarID;
        //     await docRef.collection("team").doc(docID).set({
        //         'fName': team[index].fName,
        //         'lName': team[index].lName,
        //         'jobDescription': team[index].jobDescription,
        //         'bio': team[index].bio
        //     });
        // } 
    } catch (error) {
        return res.status(404).send({"message":"failure"});
    }
    return res.send('completed');
});

exports.createFunFacts = functions.https.onRequest( async (req, res) => {
    const data = req.query; 
    const userID = data.userID;
    const title = data.title;
    const description = data.description;

    const docRef = await db.collection('funfacts').doc(userID);
    
    await docRef.set({
        'title': title,
        'description': description,
    });

    return res.send('completed');
});

exports.getMethotar = functions.https.onRequest( async (req, res) => {
    const userID = req.query.userID;
    const user = await db.collection('methotar').doc(userID).get(); 
    console.log(user.data());
    return res.send({user: user.data()});
});

exports.getFunFacts = functions.https.onRequest( async (req, res) => {
    const userID = req.query.userID;

    const user = await db.collection('funfacts').doc(userID).get(); 
    console.log(user.data());
    return res.send({
        title: user.data().title,
        description: user.data().description,
    });
});

exports.getPastProjects = functions.https.onRequest( async (req, res) => {
    const projectSnapshot = await db.collection('pastprojects').get(); 
    var json = {};
    
    try {
        projectSnapshot.forEach(doc => {
            
            console.log(doc.id);
            console.log(doc.data());
            // creates key value pair in json, Key: id Value: data
            json[doc.id] = doc.data();


        }); 
    } catch (error) {
        return res.status(404).send(error);
    }
    
    console.log(json);
    
    return res.send(json);
});

exports.addNewScore = functions.https.onRequest( async (req, res) => {
    const data = req.query;
    const methotar = data.methotar
    
    const docRef = await db.collection("leaderboard").doc();
    
    try {
        await docRef.set({
            fName: data.fName,
            lName: data.lName,
            methodtarID: data.methodtarID,
            score: data.score,
            timestamp: FieldValue.serverTimestamp()
        });
    } catch (error) {
        return res.status(404).send(error);
    }

    return res.send('completed');
});

exports.getLeaderboard = functions.https.onRequest( async (req, res) => {
    const data = req.query;
    const userID = data.userID;

    const docRef = await db.collection("leaderboard").get();

    return res.send({
        firstName: user.data().fName,
        lastName: user.data().lName,
        jobDescription: user.data().jobDescription,
        bio: user.data().bio,
    });
});
