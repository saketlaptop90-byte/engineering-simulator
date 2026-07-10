export function createOrbitalResonanceSystem(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.5 });
    const innerMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    const middleMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff });
    const outerMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5 });
    const markerMaterial1 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const markerMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 });
    const linkMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });

    // Radii
    const rInner = 3.9;
    const rMiddle = 6.3;
    const rOuter = 10.0;

    // 1. Central Star
    const starGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const centralStar = new THREE.Mesh(starGeo, starMaterial);
    centralStar.name = "CentralStar";
    group.add(centralStar);
    parts.push(centralStar);

    // 2. PlanetInner
    const innerGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const planetInner = new THREE.Mesh(innerGeo, innerMaterial);
    planetInner.name = "PlanetInner";
    group.add(planetInner);
    parts.push(planetInner);

    // 3. PlanetMiddle
    const middleGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const planetMiddle = new THREE.Mesh(middleGeo, middleMaterial);
    planetMiddle.name = "PlanetMiddle";
    group.add(planetMiddle);
    parts.push(planetMiddle);

    // 4. PlanetOuter
    const outerGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const planetOuter = new THREE.Mesh(outerGeo, outerMaterial);
    planetOuter.name = "PlanetOuter";
    group.add(planetOuter);
    parts.push(planetOuter);

    // Orbit Paths
    const createOrbitPath = (radius, name) => {
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geo, pathMaterial);
        line.name = name;
        group.add(line);
        parts.push(line);
        return line;
    };

    // 5, 6, 7. Orbit Paths
    createOrbitPath(rInner, "InnerOrbitPath");
    createOrbitPath(rMiddle, "MiddleOrbitPath");
    createOrbitPath(rOuter, "OuterOrbitPath");

    // 8. ConjunctionMarker1
    const markerGeo1 = new THREE.OctahedronGeometry(0.2);
    const marker1 = new THREE.Mesh(markerGeo1, markerMaterial1);
    marker1.name = "ConjunctionMarker1";
    group.add(marker1);
    parts.push(marker1);

    // 9. ConjunctionMarker2
    const markerGeo2 = new THREE.OctahedronGeometry(0.2);
    const marker2 = new THREE.Mesh(markerGeo2, markerMaterial2);
    marker2.name = "ConjunctionMarker2";
    group.add(marker2);
    parts.push(marker2);

    // 10. ResonanceVisualizerLink
    const linkGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
    const link = new THREE.Line(linkGeo, linkMaterial);
    link.name = "ResonanceVisualizerLink";
    group.add(link);
    parts.push(link);

    // Initial positions
    let angleOuter = 0;
    
    // Quizzes
    const quizzes = [
        {
            question: "What is an orbital resonance?",
            options: [
                "When orbiting bodies exert regular, periodic gravitational influence on each other",
                "When planets collide",
                "When a planet stops moving in its orbit",
                "When a star explodes"
            ],
            correct: 0
        },
        {
            question: "What is the specific resonance ratio of Jupiter's moons Io, Europa, and Ganymede?",
            options: ["1:1:1", "1:2:4", "2:3:4", "3:2:1"],
            correct: 1
        },
        {
            question: "What effect does the Laplace resonance have on the moons involved?",
            options: [
                "It makes them perfectly spherical",
                "It causes tidal heating due to forced eccentricity",
                "It ejects them from the solar system",
                "It freezes their oceans permanently"
            ],
            correct: 1
        },
        {
            question: "Which of these is NOT a moon involved in the 1:2:4 Laplace resonance around Jupiter?",
            options: ["Io", "Europa", "Callisto", "Ganymede"],
            correct: 2
        },
        {
            question: "If an outer moon takes 4 days to orbit, how long does the inner moon in a 1:2:4 resonance take?",
            options: ["1 day", "2 days", "8 days", "16 days"],
            correct: 0
        },
        {
            question: "According to Kepler's Third Law, how does orbital distance relate to orbital period?",
            options: [
                "Distance squared is proportional to period cubed",
                "Distance cubed is proportional to period squared",
                "Distance is directly proportional to period",
                "Distance and period have no relationship"
            ],
            correct: 1
        }
    ];

    return {
        group,
        parts,
        update: function(delta, time) {
            const speed = 0.5;
            
            angleOuter += speed * delta;
            
            const angleMiddle = angleOuter * 2;
            const angleInner = angleOuter * 4;
            
            planetOuter.position.set(Math.cos(angleOuter) * rOuter, 0, Math.sin(angleOuter) * rOuter);
            planetMiddle.position.set(Math.cos(angleMiddle) * rMiddle, 0, Math.sin(angleMiddle) * rMiddle);
            planetInner.position.set(Math.cos(angleInner) * rInner, 0, Math.sin(angleInner) * rInner);

            marker1.position.copy(planetInner.position).lerp(planetMiddle.position, 0.5);
            marker2.position.copy(planetMiddle.position).lerp(planetOuter.position, 0.5);
            
            const positions = link.geometry.attributes.position.array;
            positions[0] = planetInner.position.x;
            positions[1] = planetInner.position.y;
            positions[2] = planetInner.position.z;
            positions[3] = planetOuter.position.x;
            positions[4] = planetOuter.position.y;
            positions[5] = planetOuter.position.z;
            link.geometry.attributes.position.needsUpdate = true;
        },
        quizzes
    };
}
