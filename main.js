var sun, moon, earth, mars, venus, mercury,jupiter,uranus,neptune,saturn,pluto,sun, ring, controls, scene, camera, renderer, pointLight;
var marsOrbit, venusOrbit,earthOrbit, mercuryOrbit, jupiterOrbit , saturnOrbit, uranusOrbit, neptuneOrbit, plutoOrbit;
var planetSegments = 48;
var sunData=        constructPlanetData(5,0.001,0.001, "sun", "img/sun.png", 6, planetSegments);
var mercuryData =   constructPlanetData(88, 0.047, 9.75, "mercury", "img/mercury.png", 0.4, planetSegments);
var venusData =     constructPlanetData(225.7, 0.006, 18.075, "venus", "img/venus.png", 0.9, planetSegments);
var earthData =     constructPlanetData(365.2564, 0.015, 25, "earth", "img/earth.jpg", 1, planetSegments);
var marsData =      constructPlanetData(687, 0.868, 38.1, "mars", "img/mars.png", 0.5, planetSegments);
var jupiterData =   constructPlanetData(4329.63, 28, 130.075, "jupiter", "img/jupiter.png", 11, planetSegments);
var saturnData =    constructPlanetData(10751.44, 0.009, 237, "saturn", "img/saturn.png", 9, planetSegments);
var uranusData =    constructPlanetData(30685.55, 24.607, 480, "uranus", "img/uranus.png", 4, planetSegments);
var neptuneData =   constructPlanetData(60155.65, 0.023, 752.5, "neptune", "img/neptune.png", 3, planetSegments);
var moonData =      constructPlanetData(29.5, 0.01, 2.8, "moon", "img/moon.jpg", 0.5, planetSegments);
var orbitData = {value: 200, runOrbit: true, runRotation: true};
var clock = new THREE.Clock();

// This eliminates the redundance of having to type property names for a planet object.

function constructPlanetData(myOrbitRate, myRotationRate, myDistanceFromAxis, myName, myTexture, mySize, mySegments) {
    return {
        orbitRate: myOrbitRate
        , rotationRate: myRotationRate
        , distanceFromAxis: myDistanceFromAxis
        , name: myName
        , texture: myTexture
        , size: mySize
        , segments: mySegments
    };
}

// create a visible ring and add it to the scene.
 
function getRing(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    var ring1Material = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

 // Used to create a three dimensional ring. For the outermost ring of Saturn

 function getTube(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ringGeometry = new THREE.TorusGeometry(size, innerDiameter, facets, facets);
    var ringMaterial = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    myRing = new THREE.Mesh(ringGeometry, ringMaterial);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

//Simplifies the creation of materials used for visible objects.

function getMaterial(type, color, myTexture) {
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        map: myTexture === undefined ? null : myTexture
    };

    switch (type) {
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
}

// Draws all of the orbits to be shown in the scene.

function createVisibleOrbits() {
    var orbitWidth = 0.01;
    earthOrbit = getRing(earthData.distanceFromAxis + orbitWidth
        , earthData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "earthOrbit"
        , 0);
    mercuryOrbit = getRing(mercuryData.distanceFromAxis + orbitWidth
            , mercuryData.distanceFromAxis - orbitWidth
            , 320
            , 0xffffff
            , "mercuryOrbit"
            , 0);
    venusOrbit = getRing(venusData.distanceFromAxis + orbitWidth
                , venusData.distanceFromAxis - orbitWidth
                , 320
                , 0xffffff
                , "venusOrbit"
                , 0);
    marsOrbit = getRing(marsData.distanceFromAxis + orbitWidth
        , marsData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "venusOrbit"
        , 0);
    jupiterOrbit = getRing(jupiterData.distanceFromAxis + 0.09
            , jupiterData.distanceFromAxis - 0.09
            , 320
            , 0xffffff
            , "jupiterOrbit"
            , 0);
    saturnOrbit = getRing(saturnData.distanceFromAxis + 0.1
                , saturnData.distanceFromAxis - 0.1
                , 320
                , 0xffffff
                , "saturnOrbit"
                , 0);
    uranusOrbit = getRing(uranusData.distanceFromAxis + 0.1
                    , uranusData.distanceFromAxis - 0.1
                    , 320
                    , 0xffffff
                    , "uranusOrbit"
                    , 0);
    neptuneOrbit = getRing(neptuneData.distanceFromAxis + orbitWidth
                        , neptuneData.distanceFromAxis - orbitWidth
                        , 320
                        , 0xffffff
                        , "neptuneOrbit"
                        , 0);
}


 //Simplifies the creation of a sphere.

function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

// Creates a planet and adds it to the scene.

function loadTexturedPlanet(myData, x, y, z, myMaterialType) {
    var myMaterial;
    var passThisTexture;

    if (myData.texture && myData.texture !== "") {
        passThisTexture = new THREE.ImageUtils.loadTexture(myData.texture);
    }
    if (myMaterialType) {
        myMaterial = getMaterial(myMaterialType, "rgb(255, 255, 255 )", passThisTexture);
    } else {
        myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    var myPlanet = getSphere(myMaterial, myData.size, myData.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = myData.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
}

//Simplifies creating a light that disperses in all directions.

function getPointLight(intensity, color) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

//Move the planet around its orbit, and rotate it.

function movePlanet(myPlanet, myData, myTime, stopRotation) {
    if (orbitData.runRotation && !stopRotation) {
        myPlanet.rotation.y += myData.rotationRate;
    }
    if (orbitData.runOrbit) {
        myPlanet.position.x = Math.cos(myTime 
                * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) 
                * myData.distanceFromAxis;
        myPlanet.position.z = Math.sin(myTime 
                * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) 
                * myData.distanceFromAxis;
    }
}

//Move the moon around its orbit with the planet, and rotate it.

function moveMoon(myMoon, myPlanet, myData, myTime) {
    movePlanet(myMoon, myData, myTime);
    if (orbitData.runOrbit) {
        myMoon.position.x = myMoon.position.x + myPlanet.position.x;
        myMoon.position.z = myMoon.position.z + myPlanet.position.z;
    }
}

// This function is called in a loop to create animation.
 
function update(renderer, scene, camera, controls) {
    pointLight.position.copy(sun.position);
    controls.update();

    var time = Date.now();
    movePlanet(sun, sunData, time);
    movePlanet(mercury,mercuryData,time);
    movePlanet(venus,venusData,time);
    movePlanet(earth, earthData, time);
    movePlanet(mars,marsData,time)
    movePlanet(jupiter,jupiterData,time);
    movePlanet(saturn,saturnData,time);
    movePlanet(uranus,uranusData,time);
    movePlanet(neptune,neptuneData,time);
    
    movePlanet(ring, saturnData, time, true);
    moveMoon(moon, earth, moonData, time);

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

// This is the function that starts everything.

function init() {

    var overlay = document.getElementById( 'overlay' );
    overlay.remove();

    // Create the camera that allows us to view into the scene.
 

    camera = new THREE.PerspectiveCamera(
            45, // field of view
            window.innerWidth / window.innerHeight, // aspect ratio
            1, // near clipping plane
            1000 // far clipping plane
            );
    camera.position.z = 30;
    camera.position.x = -30;
    camera.position.y = 30;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    var listener = new THREE.AudioListener();
    camera.add(listener);

    var sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/st.ogg', function( buffer ) {
        sound.setBuffer( buffer );
        sound.autoplay=true;
	    sound.setLoop( true );
	    sound.setVolume( 0.5 );
        sound.play();
    });
    
    // Create the scene that holds all of the visible objects.
    scene = new THREE.Scene();

    // Create the renderer that controls animation.
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach the renderer to the div element.
    document.getElementById('webgl').appendChild(renderer.domElement);

    // Create controls that allows a user to move the scene with a mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Load the images used in the background.
    var path = 'cubemap/';
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    // Attach the background cube to the scene.
    scene.background = reflectionCube;

    // Create light from the sun.
    pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    // Create light that is viewable from all directions.
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);
    scene.add(sound);
   

    // Create the Earth, the Moon, planets and a ring around the saturn.
    
    mercury =loadTexturedPlanet(mercuryData,mercuryData.distanceFromAxis,0,0);
    venus =loadTexturedPlanet(venusData,venusData.distanceFromAxis,0,0);
    mars =loadTexturedPlanet(marsData,marsData.distanceFromAxis,0,0);
    jupiter =loadTexturedPlanet(jupiterData,jupiterData.distanceFromAxis,0,0);
    saturn =loadTexturedPlanet(saturnData,saturnData.distanceFromAxis,0,0);
    uranus =loadTexturedPlanet(uranusData,uranusData.distanceFromAxis,0,0);
    neptune =loadTexturedPlanet(neptuneData,neptuneData.distanceFromAxis,0,0);
    sun=loadTexturedPlanet(sunData,0,0,0);
    earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    ring = getTube(12, 1.5, 480, 0x757064, "ring", saturnData.distanceFromAxis);

    // Create the visible orbit that the Earth uses.
    createVisibleOrbits();

    var SoundControls = function () {
        this.master = sound.getVolume();
    };

    // Create the GUI that displays controls.
    var gui = new dat.GUI();

    //for sound controls
    var soundControls = new SoundControls();
    var volumeFolder = gui.addFolder( 'sound volume' );
    volumeFolder.add( soundControls, 'master' ).min( 0.0 ).max( 1.0 ).step( 0.01 ).onChange( function () {
        sound.setVolume( soundControls.master );
    } );
    
    //for speed of the planets
    var speed = gui.addFolder('speed');
    speed.add(orbitData, 'value', 0, 500);
    speed.add(orbitData, 'runOrbit', 0, 1);
    speed.add(orbitData, 'runRotation', 0, 1);

    // Start the animation.
    update(renderer, scene, camera, controls);
}

// Start everything by calling init() funtion

var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );

