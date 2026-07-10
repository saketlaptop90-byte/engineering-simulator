export function createSeafloorSeismometer(THREE) {
    const group = new THREE.Group();

    // Materials
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const floatMat = new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.7 });
    const beaconMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.2 });
    const beaconLightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const techMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.6 });
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0x2244aa });

    // 1. anchor frame (base)
    const frameBaseGeo = new THREE.BoxGeometry(4, 0.2, 4);
    const anchorFrame = new THREE.Mesh(frameBaseGeo, frameMat);
    anchorFrame.position.set(0, 0.1, 0);
    group.add(anchorFrame);

    const instrumentGroup = new THREE.Group();
    instrumentGroup.position.set(0, 0, 0);
    group.add(instrumentGroup);

    // 2. glass sphere housing
    const sphereGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const glassSphere = new THREE.Mesh(sphereGeo, glassMat);
    glassSphere.position.set(0, 2.5, 0);
    instrumentGroup.add(glassSphere);

    // 3. data recorder (inside sphere)
    const recorderGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
    const dataRecorder = new THREE.Mesh(recorderGeo, techMat);
    dataRecorder.position.set(0, 2.3, 0);
    instrumentGroup.add(dataRecorder);

    // 4. battery pack
    const batteryGeo = new THREE.BoxGeometry(1.0, 0.4, 0.8);
    const batteryPack = new THREE.Mesh(batteryGeo, techMat);
    batteryPack.position.set(0, 1.8, 0);
    instrumentGroup.add(batteryPack);

    // 5. geophone pack
    const geophoneGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const geophonePack = new THREE.Mesh(geophoneGeo, sensorMat);
    geophonePack.position.set(1.2, 0.6, 1.2);
    group.add(geophonePack);

    // 6. hydrophone
    const hydrophoneGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const hydrophone = new THREE.Mesh(hydrophoneGeo, sensorMat);
    hydrophone.position.set(-1.5, 2.5, 0);
    hydrophone.rotation.z = Math.PI / 4;
    const hydrophoneTip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), techMat);
    hydrophoneTip.position.set(0, 0.75, 0);
    hydrophone.add(hydrophoneTip);
    instrumentGroup.add(hydrophone);

    // 7. acoustic release mechanism
    const releaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 16);
    const acousticRelease = new THREE.Mesh(releaseGeo, techMat);
    acousticRelease.position.set(0, 0.8, 0);
    instrumentGroup.add(acousticRelease);

    // 8. recovery floatation
    const floatGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const float1 = new THREE.Mesh(floatGeo, floatMat);
    float1.position.set(1.5, 3.5, 0);
    instrumentGroup.add(float1);
    const float2 = new THREE.Mesh(floatGeo, floatMat);
    float2.position.set(-1.5, 3.5, 0);
    instrumentGroup.add(float2);

    // 9. flag/beacon
    const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const beaconPole = new THREE.Mesh(poleGeo, beaconMat);
    beaconPole.position.set(0, 4.5, 0);
    instrumentGroup.add(beaconPole);

    const beaconLightGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const beaconLight = new THREE.Mesh(beaconLightGeo, beaconLightMat);
    beaconLight.position.set(0, 1.0, 0);
    beaconPole.add(beaconLight);

    // 10. lifting bail
    const bailGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
    const liftingBail = new THREE.Mesh(bailGeo, frameMat);
    liftingBail.position.set(0, 3.9, 0);
    liftingBail.rotation.y = Math.PI / 4;
    instrumentGroup.add(liftingBail);

    // Animation
    const clock = new THREE.Clock();
    group.userData.update = function() {
        const time = clock.getElapsedTime();
        if (Math.sin(time * 5) > 0.8) {
            beaconLightMat.color.setHex(0xff0000);
        } else {
            beaconLightMat.color.setHex(0x330000);
        }
        
        float1.position.y = 3.5 + Math.sin(time * 2) * 0.05;
        float2.position.y = 3.5 + Math.cos(time * 2.2) * 0.05;
    };

    const quiz = [
        {
            question: "What is the primary purpose of an Ocean Bottom Seismometer (OBS)?",
            options: [
                "To measure ocean temperature and salinity",
                "To record seismic waves from earthquakes and man-made sources on the seafloor",
                "To capture video of deep-sea marine life",
                "To track the movement of submarines"
            ],
            answer: 1
        },
        {
            question: "Why does an OBS commonly use a glass sphere for housing its electronics?",
            options: [
                "Glass is inexpensive and easy to mold",
                "Glass spheres are extremely strong under uniform high pressure and are buoyant",
                "Glass spheres magnify light, making the OBS easier to find",
                "Glass prevents biological growth on the instrument"
            ],
            answer: 1
        },
        {
            question: "What is the role of the acoustic release mechanism?",
            options: [
                "To send acoustic signals to marine life",
                "To release the instrument from its anchor upon receiving a specific sound command",
                "To reduce the noise created by the seismometer",
                "To measure the speed of sound in water"
            ],
            answer: 1
        },
        {
            question: "What does the hydrophone component of an OBS measure?",
            options: [
                "Water pressure variations and acoustic signals (sound waves) in the water column",
                "The speed of ocean currents",
                "The depth of the water",
                "The salinity of the surrounding water"
            ],
            answer: 0
        },
        {
            question: "Why are geophones included in the OBS payload?",
            options: [
                "To measure the temperature of the seafloor",
                "To anchor the device firmly in the mud",
                "To record the ground motion (velocity) of the seafloor in three dimensions",
                "To communicate with satellites"
            ],
            answer: 2
        },
        {
            question: "How is an OBS typically recovered from the ocean floor?",
            options: [
                "By using a deep-sea submersible to pick it up",
                "By triggering the acoustic release, allowing its floatation to bring it to the surface",
                "By pulling it up with an attached cable from a ship",
                "It is never recovered; data is transmitted via underwater cables"
            ],
            answer: 1
        }
    ];

    return { group, quiz };
}
