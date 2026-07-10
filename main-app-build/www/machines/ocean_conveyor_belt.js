export function createOceanConveyorBelt(THREE) {
    const group = new THREE.Group();

    // 1. Thermohaline flow
    const flowGeo = new THREE.TorusGeometry(10, 0.5, 16, 100);
    const flowMat = new THREE.MeshStandardMaterial({ color: 0x0055ff, transparent: true, opacity: 0.8 });
    const thermohalineFlow = new THREE.Mesh(flowGeo, flowMat);
    group.add(thermohalineFlow);

    // 2. Gulf Stream
    const gulfPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 0, 5),
        new THREE.Vector3(-7, 2, 0),
        new THREE.Vector3(-5, 4, -3),
        new THREE.Vector3(-3, 5, -6)
    ]);
    const gulfStreamGeo = new THREE.TubeGeometry(gulfPath, 20, 0.6, 8, false);
    const gulfStreamMat = new THREE.MeshStandardMaterial({ color: 0xff4400 });
    const gulfStream = new THREE.Mesh(gulfStreamGeo, gulfStreamMat);
    group.add(gulfStream);

    // 3. North Atlantic Deep Water
    const nadwGeo = new THREE.CylinderGeometry(1, 1.5, 4, 16);
    const nadwMat = new THREE.MeshStandardMaterial({ color: 0x000088 });
    const nadw = new THREE.Mesh(nadwGeo, nadwMat);
    nadw.position.set(-3, -2, -6);
    group.add(nadw);

    // 4. Antarctic Bottom Water
    const aabwGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const aabwMat = new THREE.MeshStandardMaterial({ color: 0x000044 });
    const aabw = new THREE.Mesh(aabwGeo, aabwMat);
    aabw.position.set(0, -6, 8);
    aabw.scale.set(1, 0.3, 1);
    group.add(aabw);

    // 5. Equator surface flow
    const equatorGeo = new THREE.TorusGeometry(9.5, 0.6, 16, 50, Math.PI);
    const equatorMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
    const equatorSurfaceFlow = new THREE.Mesh(equatorGeo, equatorMat);
    equatorSurfaceFlow.rotation.x = Math.PI / 2;
    group.add(equatorSurfaceFlow);

    // 6. Upwelling zones
    const upGeo = new THREE.ConeGeometry(1.5, 4, 16);
    const upMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, transparent: true, opacity: 0.7 });
    const upwellingZones = new THREE.Mesh(upGeo, upMat);
    upwellingZones.position.set(6, -2, 4);
    group.add(upwellingZones);

    // 7. Evaporation zones
    const evapGeo = new THREE.PlaneGeometry(4, 4);
    const evapMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const evaporationZones = new THREE.Mesh(evapGeo, evapMat);
    evaporationZones.position.set(-3, 6, -6);
    evaporationZones.rotation.x = Math.PI / 2;
    group.add(evaporationZones);

    // 8. Salinity gradients
    const salGeo = new THREE.BoxGeometry(2, 2, 2);
    const salMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true });
    const salinityGradients = new THREE.Mesh(salGeo, salMat);
    salinityGradients.position.set(-3, 3.5, -6);
    group.add(salinityGradients);

    // 9. Heat transfer node
    const heatGeo = new THREE.OctahedronGeometry(1.5);
    const heatMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 });
    const heatTransferNode = new THREE.Mesh(heatGeo, heatMat);
    heatTransferNode.position.set(-5, 2, -2);
    group.add(heatTransferNode);

    // 10. Density layer
    const densityGeo = new THREE.PlaneGeometry(24, 24);
    const densityMat = new THREE.MeshStandardMaterial({ color: 0x001133, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const densityLayer = new THREE.Mesh(densityGeo, densityMat);
    densityLayer.position.y = -3;
    densityLayer.rotation.x = Math.PI / 2;
    group.add(densityLayer);

    // Animation variables
    let time = 0;

    function update(delta) {
        time += delta;

        // Animate thermohaline flow (slow global circulation)
        thermohalineFlow.rotation.y = time * 0.1;
        thermohalineFlow.rotation.x = Math.sin(time * 0.2) * 0.05;

        // Animate upwelling zones (rising water)
        upwellingZones.position.y = -2 + Math.sin(time * 2) * 0.5;

        // Animate heat transfer (pulsing energy)
        heatTransferNode.scale.setScalar(1 + Math.sin(time * 3) * 0.2);
        heatTransferNode.rotation.y = time * 1.5;

        // Animate salinity gradient (concentration changes)
        salinityGradients.rotation.x = time * 0.5;
        salinityGradients.rotation.y = time * 0.3;

        // Animate equator flow (surface currents)
        equatorSurfaceFlow.rotation.z = time * 0.2;

        // Gulf stream undulation
        gulfStream.position.y = Math.sin(time * 1.5) * 0.2;
        
        // Deep water and bottom water spreading
        nadw.scale.y = 1 + Math.sin(time) * 0.1;
        aabw.scale.x = 1 + Math.sin(time * 0.8) * 0.1;
        aabw.scale.z = 1 + Math.cos(time * 0.8) * 0.1;
        
        // Evaporation rising vapor
        evaporationZones.position.y = 6 + Math.sin(time * 2) * 0.2;
    }

    const quiz = [
        {
            question: "What primarily drives the Global Ocean Conveyor Belt?",
            options: ["Wind currents", "Temperature and salinity differences", "Lunar gravity", "Earth's rotation"],
            answer: 1
        },
        {
            question: "Which water mass is known for being extremely cold and dense?",
            options: ["Gulf Stream", "North Atlantic Deep Water", "Antarctic Bottom Water", "Equator surface flow"],
            answer: 2
        },
        {
            question: "What happens to water in the North Atlantic to cause it to sink?",
            options: ["It gets warmer and fresher", "It becomes colder and saltier", "It is pushed down by wind", "It evaporates completely"],
            answer: 1
        },
        {
            question: "What is the process called where deep, cold, nutrient-rich water rises to the surface?",
            options: ["Evaporation", "Downwelling", "Upwelling", "Subduction"],
            answer: 2
        },
        {
            question: "How does evaporation affect ocean water?",
            options: ["It decreases salinity", "It increases salinity", "It decreases temperature", "It increases density only by cooling"],
            answer: 1
        },
        {
            question: "Which current is a major surface flow carrying warm water to the North Atlantic?",
            options: ["Antarctic Circumpolar Current", "California Current", "Gulf Stream", "Peru Current"],
            answer: 2
        }
    ];

    return {
        group,
        update,
        quiz
    };
}
