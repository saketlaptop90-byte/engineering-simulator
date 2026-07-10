export function createFluidCatalyticCracker(THREE) {
    const machine = new THREE.Group();

    // 1. Feed Injector
    const injectorGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const injectorMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const feedInjector = new THREE.Mesh(injectorGeo, injectorMat);
    feedInjector.rotation.z = Math.PI / 2;
    feedInjector.position.set(-0.75, 1, 0);
    feedInjector.userData.name = "Feed Injector";
    machine.add(feedInjector);

    // 2. Riser Reactor
    const riserGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
    const riserMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.5, metalness: 0.3 });
    const riserReactor = new THREE.Mesh(riserGeo, riserMat);
    riserReactor.position.set(0, 5, 0);
    riserReactor.userData.name = "Riser Reactor";
    machine.add(riserReactor);

    // 3. Stripping Section
    const stripperGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const stripperMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.4, metalness: 0.3 });
    const strippingSection = new THREE.Mesh(stripperGeo, stripperMat);
    strippingSection.position.set(0, 11, 0);
    strippingSection.userData.name = "Stripping Section";
    machine.add(strippingSection);

    // 4. Spent Catalyst Standpipe
    const spentPipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    const spentPipeMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.4 });
    const spentCatalystStandpipe = new THREE.Mesh(spentPipeGeo, spentPipeMat);
    spentCatalystStandpipe.position.set(2.5, 8.5, 0);
    spentCatalystStandpipe.rotation.z = -Math.PI / 4;
    spentCatalystStandpipe.userData.name = "Spent Catalyst Standpipe";
    machine.add(spentCatalystStandpipe);

    // 5. Regenerator Vessel
    const regeneratorGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 32);
    const regeneratorMat = new THREE.MeshStandardMaterial({ color: 0xcc6633, roughness: 0.7, metalness: 0.2 });
    const regeneratorVessel = new THREE.Mesh(regeneratorGeo, regeneratorMat);
    regeneratorVessel.position.set(5, 7, 0);
    regeneratorVessel.userData.name = "Regenerator Vessel";
    machine.add(regeneratorVessel);

    // 6. Air Grid Distributor
    const gridGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.2, 32);
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const airGridDistributor = new THREE.Mesh(gridGeo, gridMat);
    airGridDistributor.position.set(5, 4.5, 0);
    airGridDistributor.userData.name = "Air Grid Distributor";
    machine.add(airGridDistributor);

    // 7. Cyclone Separators
    const cycloneGeo = new THREE.ConeGeometry(0.8, 1.5, 16);
    const cycloneMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.5 });
    const cycloneSeparators = new THREE.Group();
    
    const c1 = new THREE.Mesh(cycloneGeo, cycloneMat);
    c1.position.set(4.2, 9, 0);
    c1.rotation.z = Math.PI;
    
    const c2 = new THREE.Mesh(cycloneGeo, cycloneMat);
    c2.position.set(5.8, 9, 0);
    c2.rotation.z = Math.PI;
    
    cycloneSeparators.add(c1);
    cycloneSeparators.add(c2);
    cycloneSeparators.userData.name = "Cyclone Separators";
    machine.add(cycloneSeparators);

    // 8. Flue Gas Outlet
    const fluePipeGeo = new THREE.CylinderGeometry(0.6, 0.6, 4, 16);
    const fluePipeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.4 });
    const flueGasOutlet = new THREE.Mesh(fluePipeGeo, fluePipeMat);
    flueGasOutlet.position.set(5, 11.5, 0);
    flueGasOutlet.userData.name = "Flue Gas Outlet";
    machine.add(flueGasOutlet);

    // 9. Regenerated Catalyst Standpipe
    const regenPipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    const regenPipeMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.4 });
    const regeneratedCatalystStandpipe = new THREE.Mesh(regenPipeGeo, regenPipeMat);
    regeneratedCatalystStandpipe.position.set(2.5, 3.5, 0);
    regeneratedCatalystStandpipe.rotation.z = Math.PI / 4;
    regeneratedCatalystStandpipe.userData.name = "Regenerated Catalyst Standpipe";
    machine.add(regeneratedCatalystStandpipe);

    // 10. Main Fractionator
    const fracGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 32);
    const fracMat = new THREE.MeshStandardMaterial({ color: 0x446688, roughness: 0.3, metalness: 0.6 });
    const mainFractionator = new THREE.Mesh(fracGeo, fracMat);
    mainFractionator.position.set(-5, 6, 0);
    mainFractionator.userData.name = "Main Fractionator";
    machine.add(mainFractionator);

    // Connection pipe from stripper to fractionator (visual)
    const connPipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 5, 16);
    const connPipeMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.4 });
    const connPipe = new THREE.Mesh(connPipeGeo, connPipeMat);
    connPipe.position.set(-2.5, 12, 0);
    connPipe.rotation.z = Math.PI / 2;
    machine.add(connPipe);

    // Ground plane for reference
    const baseGeo = new THREE.BoxGeometry(16, 0.5, 8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, -0.25, 0);
    machine.add(base);

    // Catalyst Particles Animation
    const particles = new THREE.Group();
    const particleCount = 80;
    const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const regenMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x663300 });
    const spentMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    
    const pData = [];
    
    for(let i=0; i<particleCount; i++) {
        const mesh = new THREE.Mesh(particleGeo, regenMat);
        particles.add(mesh);
        pData.push({
            progress: i / particleCount,
            offsetX: (Math.random() - 0.5) * 0.4,
            offsetY: (Math.random() - 0.5) * 0.4,
            offsetZ: (Math.random() - 0.5) * 0.4
        });
    }
    machine.add(particles);

    machine.tick = (delta) => {
        pData.forEach((d, i) => {
            d.progress += delta * 0.2; // 5 seconds per cycle
            if(d.progress > 1) d.progress -= 1;
            
            let p = d.progress;
            let x = 0, y = 0, z = 0;
            
            // Path logic
            if (p < 0.4) {
                // Riser up
                let t = p / 0.4;
                x = 0;
                y = 1 + t * 9; 
            } else if (p < 0.55) {
                // Spent pipe down to regenerator
                let t = (p - 0.4) / 0.15;
                x = t * 5;
                y = 10 - t * 3; 
            } else if (p < 0.8) {
                // Inside regenerator (falling/circulating)
                let t = (p - 0.55) / 0.25;
                x = 5 + Math.sin(t * Math.PI * 4) * 1.5;
                z = Math.cos(t * Math.PI * 4) * 1.5;
                y = 7 - t * 2.5; 
            } else {
                // Regen pipe down to riser bottom
                let t = (p - 0.8) / 0.2;
                x = 5 - t * 5; 
                y = 4.5 - t * 3.5; 
            }
            
            const mesh = particles.children[i];
            mesh.position.set(x + d.offsetX, y + d.offsetY, z + d.offsetZ);
            
            // Color logic
            if (p > 0.4 && p < 0.8) {
                mesh.material = spentMat;
            } else {
                mesh.material = regenMat;
            }
        });
    };

    machine.userData.quiz = [
        {
            question: "What is the primary function of the Fluid Catalytic Cracker (FCC)?",
            options: [
                "To break long-chain hydrocarbons into shorter, more valuable products",
                "To remove sulfur from the feed",
                "To distil crude oil into fractions",
                "To combine light gases into heavier liquids"
            ],
            correctAnswer: 0
        },
        {
            question: "In which part of the FCC unit does the main cracking reaction occur?",
            options: [
                "Main fractionator",
                "Riser reactor",
                "Regenerator vessel",
                "Stripping section"
            ],
            correctAnswer: 1
        },
        {
            question: "What happens in the regenerator vessel?",
            options: [
                "Heavy hydrocarbons are vaporized",
                "Products are separated by boiling point",
                "Coke is burned off the catalyst to restore its activity",
                "Fresh feed is mixed with steam"
            ],
            correctAnswer: 2
        },
        {
            question: "Why is the catalyst fluidized?",
            options: [
                "To prevent it from dissolving in the oil",
                "To dissolve it in the hydrocarbon stream",
                "To make it heavier so it settles quickly",
                "To make it flow like a liquid and transfer heat effectively"
            ],
            correctAnswer: 3
        },
        {
            question: "What is the purpose of the cyclone separators in an FCC unit?",
            options: [
                "To separate catalyst particles from vapor and flue gas streams",
                "To separate light products from heavy products",
                "To mix the feed with the catalyst",
                "To compress the air entering the regenerator"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the role of the stripping section?",
            options: [
                "To burn off the coke from the catalyst",
                "To use steam to remove hydrocarbon vapors trapped in the spent catalyst",
                "To fractionate the cracked products",
                "To inject fresh feed into the riser"
            ],
            correctAnswer: 1
        }
    ];

    return machine;
}
