export function createRadioTelescopeArray(THREE) {
    const arrayGroup = new THREE.Group();

    // Materials
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.2, roughness: 0.7, side: THREE.DoubleSide });
    const gearMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.5 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0xaabbcc, roughness: 0.6 });
    const railMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.5 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.4 });
    const cryoMat = new THREE.MeshStandardMaterial({ color: 0x113355, metalness: 0.7, roughness: 0.2 });
    const opticMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff4400, emissiveIntensity: 0.2 });

    // 6. Central supercomputer/correlator building
    const buildingGeom = new THREE.BoxGeometry(10, 5, 10);
    const building = new THREE.Mesh(buildingGeom, buildingMat);
    building.position.set(0, 2.5, 0);
    arrayGroup.add(building);

    // 10. Array rail tracks
    const railGroup = new THREE.Group();
    const trackWidth = 4;
    const trackLength = 50;
    
    function createTrack(angle) {
        const track = new THREE.Group();
        const rail1Geom = new THREE.BoxGeometry(0.2, 0.4, trackLength);
        const rail1 = new THREE.Mesh(rail1Geom, railMat);
        rail1.position.set(-trackWidth/2, 0.2, trackLength/2);
        
        const rail2 = new THREE.Mesh(rail1Geom, railMat);
        rail2.position.set(trackWidth/2, 0.2, trackLength/2);
        
        track.add(rail1);
        track.add(rail2);
        track.rotation.y = angle;
        return track;
    }
    
    railGroup.add(createTrack(0));
    railGroup.add(createTrack((2 * Math.PI) / 3));
    railGroup.add(createTrack((4 * Math.PI) / 3));
    arrayGroup.add(railGroup);

    // 7. Fiber optic transmission lines
    const fiberGroup = new THREE.Group();
    function createFiber(angle) {
        const fiberGeom = new THREE.CylinderGeometry(0.1, 0.1, trackLength, 8);
        const fiber = new THREE.Mesh(fiberGeom, opticMat);
        fiber.rotation.x = Math.PI / 2;
        fiber.position.set(0, 0.1, trackLength/2);
        const wrapper = new THREE.Group();
        wrapper.add(fiber);
        wrapper.rotation.y = angle;
        return wrapper;
    }
    fiberGroup.add(createFiber(0));
    fiberGroup.add(createFiber((2 * Math.PI) / 3));
    fiberGroup.add(createFiber((4 * Math.PI) / 3));
    arrayGroup.add(fiberGroup);

    function createTelescope() {
        const baseGroup = new THREE.Group();

        // 8. Mounting pedestals
        const pedestalGeom = new THREE.CylinderGeometry(2, 2.5, 4, 16);
        const pedestal = new THREE.Mesh(pedestalGeom, concreteMat);
        pedestal.position.y = 2;
        baseGroup.add(pedestal);

        // 5. Azimuth tracks
        const azTrackGeom = new THREE.CylinderGeometry(2.1, 2.1, 0.5, 32);
        const azTrack = new THREE.Mesh(azTrackGeom, gearMat);
        azTrack.position.y = 4.25;
        baseGroup.add(azTrack);

        const azGroup = new THREE.Group();
        azGroup.position.y = 4.5;
        baseGroup.add(azGroup);

        const forkGeom = new THREE.BoxGeometry(4, 5, 1);
        const fork1 = new THREE.Mesh(forkGeom, steelMat);
        fork1.position.set(2, 2.5, 0);
        const fork2 = new THREE.Mesh(forkGeom, steelMat);
        fork2.position.set(-2, 2.5, 0);
        azGroup.add(fork1);
        azGroup.add(fork2);

        // 4. Altitude gears
        const altGearGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16);
        altGearGeom.rotateZ(Math.PI / 2);
        const altGear1 = new THREE.Mesh(altGearGeom, gearMat);
        altGear1.position.set(2.25, 4.5, 0);
        azGroup.add(altGear1);

        const altGear2 = new THREE.Mesh(altGearGeom, gearMat);
        altGear2.position.set(-2.25, 4.5, 0);
        azGroup.add(altGear2);

        const altGroup = new THREE.Group();
        altGroup.position.set(0, 4.5, 0);
        azGroup.add(altGroup);

        // 1. Parabolic dish reflectors
        const points = [];
        for (let i = 0; i <= 20; i++) {
            const x = (i / 20) * 6;
            const y = (x * x) / 10;
            points.push(new THREE.Vector2(x, y));
        }
        for (let i = 20; i >= 0; i--) {
            const x = (i / 20) * 6;
            const y = (x * x) / 10 + 0.2;
            points.push(new THREE.Vector2(x, y));
        }
        const dishGeom = new THREE.LatheGeometry(points, 32);
        const dish = new THREE.Mesh(dishGeom, dishMat);
        dish.rotation.x = -Math.PI / 2;
        altGroup.add(dish);

        // 3. Receiver feeds
        const feedGeom = new THREE.CylinderGeometry(0.3, 0.3, 2);
        feedGeom.rotateX(Math.PI / 2);
        const feed = new THREE.Mesh(feedGeom, copperMat);
        feed.position.set(0, 0, 0.5);
        altGroup.add(feed);

        // 9. Cryogenic coolers
        const cryoGeom = new THREE.BoxGeometry(1, 1, 1.5);
        const cryo = new THREE.Mesh(cryoGeom, cryoMat);
        cryo.position.set(0, 0, -1);
        altGroup.add(cryo);

        // 2. Subreflectors
        const subGeom = new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const subreflector = new THREE.Mesh(subGeom, dishMat);
        subreflector.rotation.x = Math.PI / 2;
        subreflector.position.set(0, 0, 2.5);
        altGroup.add(subreflector);

        for(let i=0; i<4; i++) {
            const angle = (i * Math.PI) / 2;
            const r = 4;
            const start = new THREE.Vector3(r*Math.cos(angle), r*Math.sin(angle), 1.6);
            const end = new THREE.Vector3(0, 0, 2.5);
            const length = start.distanceTo(end);
            
            const realStrutGeom = new THREE.CylinderGeometry(0.05, 0.05, length);
            const realStrut = new THREE.Mesh(realStrutGeom, wireMat);
            
            const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            realStrut.position.copy(midpoint);
            
            const direction = new THREE.Vector3().subVectors(end, start).normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            realStrut.setRotationFromQuaternion(quaternion);
            
            altGroup.add(realStrut);
        }

        return {
            base: baseGroup,
            az: azGroup,
            alt: altGroup
        };
    }

    const telescopes = [];
    function getTrackPos(trackAngle, dist) {
        return new THREE.Vector3(
            dist * Math.sin(trackAngle),
            0,
            dist * Math.cos(trackAngle)
        );
    }

    const t1 = createTelescope();
    t1.base.position.copy(getTrackPos(0, 15));
    arrayGroup.add(t1.base);
    telescopes.push({ obj: t1, angle: 0, distance: 15, moving: false });

    const t2 = createTelescope();
    t2.base.position.copy(getTrackPos(2*Math.PI/3, 20));
    arrayGroup.add(t2.base);
    telescopes.push({ obj: t2, angle: 2*Math.PI/3, distance: 20, moving: true, offset: 0 });

    const t3 = createTelescope();
    t3.base.position.copy(getTrackPos(4*Math.PI/3, 25));
    arrayGroup.add(t3.base);
    telescopes.push({ obj: t3, angle: 4*Math.PI/3, distance: 25, moving: true, offset: Math.PI });

    let timeAcc = 0;

    arrayGroup.userData.update = function(deltaTime) {
        timeAcc += deltaTime;

        // Kinematics: unison tracking
        const targetAzimuth = timeAcc * 0.1;
        const targetAltitude = Math.PI / 4 + Math.sin(timeAcc * 0.05) * 0.2;

        telescopes.forEach(t => {
            t.obj.az.rotation.y = targetAzimuth;
            t.obj.alt.rotation.x = targetAltitude;

            if (t.moving) {
                // oscillate along the track
                const currentDist = t.distance + Math.sin(timeAcc * 0.2 + t.offset) * 10;
                t.obj.base.position.copy(getTrackPos(t.angle, currentDist));
            }
        });
    };

    arrayGroup.userData.quiz = [
        {
            question: "What is the primary purpose of arranging multiple radio telescopes into an interferometric array?",
            options: [
                "To synthesize a single large aperture and achieve higher angular resolution.",
                "To capture more light from the sun.",
                "To prevent interference from nearby radio stations.",
                "To cool down the receivers more effectively."
            ],
            correctAnswer: 0
        },
        {
            question: "What is the function of the subreflector in a Cassegrain radio telescope design?",
            options: [
                "To focus the incoming radio waves down towards the receiver feed.",
                "To filter out optical light from the incoming signal.",
                "To provide structural support for the parabolic dish.",
                "To convert radio waves into electrical signals."
            ],
            correctAnswer: 0
        },
        {
            question: "Why are cryogenic coolers essential for the receiver feeds of deep-space radio telescopes?",
            options: [
                "To reduce thermal noise and improve signal-to-noise ratio.",
                "To keep the antenna from melting under intense sunlight.",
                "To superconduct the fiber optic cables.",
                "To generate a localized magnetic field."
            ],
            correctAnswer: 0
        },
        {
            question: "What role does the correlator supercomputer play in an interferometric array?",
            options: [
                "It combines and processes the signals from all antennas to form a cohesive image or spectrum.",
                "It controls the power supply to the moving tracks.",
                "It generates the radio waves that are broadcasted to deep space.",
                "It predicts the weather to protect the dishes from storms."
            ],
            correctAnswer: 0
        },
        {
            question: "In our array, why do the individual telescopes slide along rail tracks?",
            options: [
                "To alter the array's baselines, which changes the effective resolution and field of view.",
                "To move them into a garage for nightly maintenance.",
                "To avoid overlapping shadows when the sun is low.",
                "To distribute the weight of the telescopes across the ground."
            ],
            correctAnswer: 0
        },
        {
            question: "Which mechanical components allow a single radio telescope to point anywhere in the sky?",
            options: [
                "The azimuth track and altitude gears.",
                "The mounting pedestal and parabolic dish.",
                "The fiber optic lines and cryogenic cooler.",
                "The subreflector and the receiver feed."
            ],
            correctAnswer: 0
        }
    ];

    return arrayGroup;
}
