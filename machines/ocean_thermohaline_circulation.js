export function createOceanThermohalineCirculation(THREE) {
    const group = new THREE.Group();

    // 1. Warm Surface Current
    const warmSurfaceCurrent = new THREE.Group();
    warmSurfaceCurrent.name = "Warm Surface Current";
    const surfaceCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, -12),
        new THREE.Vector3(6, 5, -6),
        new THREE.Vector3(9, 5, 0),
        new THREE.Vector3(6, 5, 6),
        new THREE.Vector3(0, 5, 12)
    ]);
    const warmGeom = new THREE.TubeGeometry(surfaceCurve, 100, 0.5, 12, false);
    const warmMat = new THREE.MeshPhysicalMaterial({
        color: 0xff3333,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        transmission: 0.5,
        thickness: 0.5
    });
    const warmMesh = new THREE.Mesh(warmGeom, warmMat);
    warmSurfaceCurrent.add(warmMesh);
    group.add(warmSurfaceCurrent);

    // 2. Cold Deep Current
    const coldDeepCurrent = new THREE.Group();
    coldDeepCurrent.name = "Cold Deep Current";
    const deepCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -5, 12),
        new THREE.Vector3(-6, -5, 6),
        new THREE.Vector3(-9, -5, 0),
        new THREE.Vector3(-6, -5, -6),
        new THREE.Vector3(0, -5, -12)
    ]);
    const coldGeom = new THREE.TubeGeometry(deepCurve, 100, 0.7, 12, false);
    const coldMat = new THREE.MeshPhysicalMaterial({
        color: 0x1133ff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.3,
        transmission: 0.6,
        thickness: 0.8
    });
    const coldMesh = new THREE.Mesh(coldGeom, coldMat);
    coldDeepCurrent.add(coldMesh);
    group.add(coldDeepCurrent);

    // 3. Upwelling Zone
    const upwellingZone = new THREE.Group();
    upwellingZone.name = "Upwelling Zone";
    const upCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -5, -12),
        new THREE.Vector3(0, 0, -12),
        new THREE.Vector3(0, 5, -12)
    ]);
    const upTube = new THREE.Mesh(
        new THREE.TubeGeometry(upCurve, 20, 0.6, 12, false),
        new THREE.MeshBasicMaterial({ color: 0x33ccff, transparent: true, opacity: 0.5 })
    );
    upwellingZone.add(upTube);
    group.add(upwellingZone);

    // 4. Downwelling Zone
    const downwellingZone = new THREE.Group();
    downwellingZone.name = "Downwelling Zone";
    const downCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, 12),
        new THREE.Vector3(0, 0, 12),
        new THREE.Vector3(0, -5, 12)
    ]);
    const downTube = new THREE.Mesh(
        new THREE.TubeGeometry(downCurve, 20, 0.6, 12, false),
        new THREE.MeshBasicMaterial({ color: 0xcc33ff, transparent: true, opacity: 0.5 })
    );
    downwellingZone.add(downTube);
    group.add(downwellingZone);

    // 5. Sea Ice Formation
    const seaIceFormation = new THREE.Group();
    seaIceFormation.name = "Sea Ice Formation";
    const iceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 });
    for(let i=0; i<8; i++) {
        const ice = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 2), iceMat);
        ice.position.set(Math.random() * 6 - 3, 5.25, 12 + Math.random() * 4 - 2);
        ice.rotation.y = Math.random() * Math.PI;
        seaIceFormation.add(ice);
    }
    group.add(seaIceFormation);

    // 6. North Atlantic Deep Water (NADW)
    const nadw = new THREE.Group();
    nadw.name = "North Atlantic Deep Water";
    const nadwVolume = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshPhysicalMaterial({ color: 0x000088, transparent: true, opacity: 0.8, transmission: 0.9 })
    );
    nadwVolume.scale.set(1, 0.5, 1.5);
    nadwVolume.position.set(0, -3, 10);
    nadw.add(nadwVolume);
    group.add(nadw);

    // 7. Antarctic Bottom Water (AABW)
    const aabw = new THREE.Group();
    aabw.name = "Antarctic Bottom Water";
    const aabwVolume = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 32, 32),
        new THREE.MeshPhysicalMaterial({ color: 0x000044, transparent: true, opacity: 0.9, transmission: 0.9 })
    );
    aabwVolume.scale.set(1.5, 0.4, 1.5);
    aabwVolume.position.set(0, -6, -10);
    aabw.add(aabwVolume);
    group.add(aabw);

    // 8. Continental Boundary
    const continentalBoundary = new THREE.Group();
    continentalBoundary.name = "Continental Boundary";
    const contMat = new THREE.MeshStandardMaterial({ color: 0x2d8a2d, roughness: 0.8 });
    const cont1 = new THREE.Mesh(new THREE.BoxGeometry(5, 12, 8), contMat);
    cont1.position.set(6, 0, 0);
    const cont2 = new THREE.Mesh(new THREE.BoxGeometry(5, 12, 8), contMat);
    cont2.position.set(-6, 0, 0);
    continentalBoundary.add(cont1, cont2);
    group.add(continentalBoundary);

    // 9. Salinity Gradient Indicator
    const salinityIndicator = new THREE.Group();
    salinityIndicator.name = "Salinity Gradient Indicator";
    for(let i=0; i<10; i++) {
        const sal = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.3),
            new THREE.MeshBasicMaterial({ color: 0xdddddd })
        );
        // High salinity near downwelling (poles)
        sal.position.set(Math.random()*4 - 2, Math.random()*10 - 5, 11 + Math.random()*2);
        salinityIndicator.add(sal);
    }
    group.add(salinityIndicator);

    // 10. Heat Release Vents
    const heatReleaseVents = new THREE.Group();
    heatReleaseVents.name = "Heat Release Vents";
    const heatMat = new THREE.MeshBasicMaterial({ color: 0xff8888, transparent: true, opacity: 0.6 });
    for(let i=0; i<5; i++) {
        const vent = new THREE.Mesh(new THREE.ConeGeometry(0.6, 3, 16), heatMat);
        vent.position.set(Math.random()*2 - 1, 6 + Math.random(), 10 + Math.random()*2);
        vent.rotation.x = Math.PI / 8;
        heatReleaseVents.add(vent);
    }
    group.add(heatReleaseVents);

    // Animation variables
    const clock = new THREE.Clock();
    
    // Particles for current flow
    const flowGroup = new THREE.Group();
    const particleCount = 40;
    const warmParticles = [];
    const coldParticles = [];
    
    const pGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const pMatWarm = new THREE.MeshBasicMaterial({ color: 0xffff55 });
    const pMatCold = new THREE.MeshBasicMaterial({ color: 0x55ffff });

    for(let i=0; i<particleCount; i++) {
        const wp = new THREE.Mesh(pGeo, pMatWarm);
        wp.userData.t = i / particleCount;
        flowGroup.add(wp);
        warmParticles.push(wp);
        
        const cp = new THREE.Mesh(pGeo, pMatCold);
        cp.userData.t = i / particleCount;
        flowGroup.add(cp);
        coldParticles.push(cp);
    }
    group.add(flowGroup);

    // The animation loop
    group.tick = function(delta) {
        if (!delta) delta = clock.getDelta();
        const speed = 0.15;
        
        warmParticles.forEach(p => {
            p.userData.t += speed * delta;
            if(p.userData.t > 1) p.userData.t -= 1;
            const pos = surfaceCurve.getPointAt(p.userData.t);
            p.position.copy(pos);
        });
        
        coldParticles.forEach(p => {
            p.userData.t += speed * delta;
            if(p.userData.t > 1) p.userData.t -= 1;
            const pos = deepCurve.getPointAt(p.userData.t);
            p.position.copy(pos);
        });

        // Animate heat vents
        const time = Date.now() * 0.003;
        heatReleaseVents.children.forEach((vent, index) => {
            vent.position.y += Math.sin(time + index) * 0.01;
            vent.material.opacity = 0.3 + Math.sin(time + index) * 0.3;
        });

        // Animate salinity indicators drifting down slowly
        salinityIndicator.children.forEach(sal => {
            sal.position.y -= 0.5 * delta;
            sal.rotation.x += 1 * delta;
            sal.rotation.y += 1 * delta;
            if (sal.position.y < -5) {
                sal.position.y = 5;
            }
        });
    };

    // Store parts
    group.userData.parts = [
        warmSurfaceCurrent,
        coldDeepCurrent,
        upwellingZone,
        downwellingZone,
        seaIceFormation,
        nadw,
        aabw,
        continentalBoundary,
        salinityIndicator,
        heatReleaseVents
    ];

    // Quiz Questions
    group.userData.questions = [
        {
            question: "What primarily drives the ocean thermohaline circulation?",
            options: [
                "Temperature and salinity differences",
                "Wind",
                "The Coriolis effect",
                "Tides"
            ],
            correctAnswerIndex: 0
        },
        {
            question: "Where does deep water formation primarily occur?",
            options: [
                "The North Atlantic and the Southern Ocean",
                "The Equator",
                "The Indian Ocean",
                "The Mediterranean Sea"
            ],
            correctAnswerIndex: 0
        },
        {
            question: "What effect does sea ice formation have on the surrounding water?",
            options: [
                "It increases salinity by leaving salt behind (brine rejection).",
                "It decreases salinity by adding freshwater.",
                "It warms the surrounding water.",
                "It has no effect on salinity."
            ],
            correctAnswerIndex: 0
        },
        {
            question: "How long does it roughly take for a parcel of water to complete the global conveyor belt loop?",
            options: [
                "1,000 years",
                "10 years",
                "100,000 years",
                "1 month"
            ],
            correctAnswerIndex: 0
        },
        {
            question: "Which deep water mass is generally the coldest and densest in the world's oceans?",
            options: [
                "Antarctic Bottom Water (AABW)",
                "North Atlantic Deep Water (NADW)",
                "Mediterranean Outflow Water",
                "Antarctic Intermediate Water"
            ],
            correctAnswerIndex: 0
        },
        {
            question: "What happens to the heat transported by the warm surface currents when they reach high latitudes?",
            options: [
                "It is released into the atmosphere, helping to moderate regional climates.",
                "It is absorbed by sea ice, melting it entirely.",
                "It is transported directly to the deep ocean without changing.",
                "It is reflected back to the equator."
            ],
            correctAnswerIndex: 0
        }
    ];

    return group;
}
