export function createHydrodesulfurizationUnit(THREE) {
    const group = new THREE.Group();

    // Materials
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x336699, roughness: 0.6, metalness: 0.5 });
    const compMat = new THREE.MeshStandardMaterial({ color: 0x993333, roughness: 0.5, metalness: 0.7 });
    const heatExMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.8 });
    const heaterMat = new THREE.MeshStandardMaterial({ color: 0xff5500, roughness: 0.8, metalness: 0.2 });
    const reactorMat = new THREE.MeshStandardMaterial({ color: 0x228822, roughness: 0.6, metalness: 0.4 });
    const hpSepMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, roughness: 0.4, metalness: 0.6 });
    const lpSepMat = new THREE.MeshStandardMaterial({ color: 0x6666ff, roughness: 0.4, metalness: 0.6 });
    const scrubberMat = new THREE.MeshStandardMaterial({ color: 0x22aaaa, roughness: 0.5, metalness: 0.5 });
    const stripperMat = new THREE.MeshStandardMaterial({ color: 0xaa22aa, roughness: 0.5, metalness: 0.4 });
    const outletMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.2, metalness: 0.9 });

    // 1. Sour Feed Pump
    const pumpGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const sourFeedPump = new THREE.Mesh(pumpGeom, pumpMat);
    sourFeedPump.position.set(-8, 0.5, 2);
    sourFeedPump.castShadow = true;
    sourFeedPump.receiveShadow = true;
    group.add(sourFeedPump);

    // 2. Hydrogen Makeup Compressor
    const compGeom = new THREE.BoxGeometry(1.5, 1, 1.5);
    const hydrogenCompressor = new THREE.Mesh(compGeom, compMat);
    hydrogenCompressor.position.set(-8, 0.5, -2);
    hydrogenCompressor.castShadow = true;
    hydrogenCompressor.receiveShadow = true;
    group.add(hydrogenCompressor);

    // 3. Feed/Effluent Heat Exchanger
    const heatExGeom = new THREE.CylinderGeometry(0.6, 0.6, 4, 16);
    const feedEffluentExchanger = new THREE.Mesh(heatExGeom, heatExMat);
    feedEffluentExchanger.rotation.z = Math.PI / 2;
    feedEffluentExchanger.position.set(-4, 0.6, 0);
    feedEffluentExchanger.castShadow = true;
    feedEffluentExchanger.receiveShadow = true;
    group.add(feedEffluentExchanger);

    // 4. Fired Heater
    const heaterGeom = new THREE.BoxGeometry(2.5, 4, 2.5);
    const firedHeater = new THREE.Mesh(heaterGeom, heaterMat);
    firedHeater.position.set(0, 2, 0);
    firedHeater.castShadow = true;
    firedHeater.receiveShadow = true;
    group.add(firedHeater);

    // 5. Catalytic Reactor Bed
    const reactorGeom = new THREE.CylinderGeometry(1.5, 1.5, 6, 32);
    const catalyticReactor = new THREE.Mesh(reactorGeom, reactorMat);
    catalyticReactor.position.set(4, 3, 0);
    catalyticReactor.castShadow = true;
    catalyticReactor.receiveShadow = true;
    group.add(catalyticReactor);

    // 6. High Pressure Separator
    const hpSepGeom = new THREE.CylinderGeometry(1, 1, 3.5, 16);
    const highPressureSeparator = new THREE.Mesh(hpSepGeom, hpSepMat);
    highPressureSeparator.position.set(8, 1.75, 1.5);
    highPressureSeparator.castShadow = true;
    highPressureSeparator.receiveShadow = true;
    group.add(highPressureSeparator);

    // 7. Low Pressure Separator
    const lpSepGeom = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 16);
    const lowPressureSeparator = new THREE.Mesh(lpSepGeom, lpSepMat);
    lowPressureSeparator.position.set(11, 1.25, 1.5);
    lowPressureSeparator.castShadow = true;
    lowPressureSeparator.receiveShadow = true;
    group.add(lowPressureSeparator);

    // 8. Recycle Gas Scrubber
    const scrubberGeom = new THREE.CylinderGeometry(0.9, 0.9, 5, 16);
    const recycleGasScrubber = new THREE.Mesh(scrubberGeom, scrubberMat);
    recycleGasScrubber.position.set(8, 2.5, -2);
    recycleGasScrubber.castShadow = true;
    recycleGasScrubber.receiveShadow = true;
    group.add(recycleGasScrubber);

    // 9. Stripper Column
    const stripperGeom = new THREE.CylinderGeometry(1.2, 1.2, 7, 16);
    const stripperColumn = new THREE.Mesh(stripperGeom, stripperMat);
    stripperColumn.position.set(14, 3.5, 0);
    stripperColumn.castShadow = true;
    stripperColumn.receiveShadow = true;
    group.add(stripperColumn);

    // 10. Sweet Product Outlet
    const outletGeom = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
    const sweetProductOutlet = new THREE.Mesh(outletGeom, outletMat);
    sweetProductOutlet.rotation.z = Math.PI / 2;
    sweetProductOutlet.position.set(17, 0.4, 0);
    sweetProductOutlet.castShadow = true;
    sweetProductOutlet.receiveShadow = true;
    group.add(sweetProductOutlet);

    // Base platform for aesthetics
    const baseGeom = new THREE.BoxGeometry(28, 0.2, 10);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.set(4, -0.1, 0);
    base.receiveShadow = true;
    group.add(base);

    // Animation Particles (Liquid + Hydrogen)
    const particleCount = 25;
    const particles = new THREE.Group();
    const liquidMat = new THREE.MeshBasicMaterial({ color: 0x8b4513 }); // Sour liquid (brownish)
    const gasMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });    // Hydrogen gas (cyan)
    const cleanMat = new THREE.MeshBasicMaterial({ color: 0xdddd00 });  // Clean product (yellowish)
    const h2sMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });    // H2S gas (red)

    const pData = [];
    for (let i = 0; i < particleCount; i++) {
        const isGas = i % 2 === 0;
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), isGas ? gasMat : liquidMat);
        particles.add(mesh);
        pData.push({
            mesh: mesh,
            progress: i / particleCount,
            isGas: isGas
        });
    }
    group.add(particles);

    // Curve path for the fluid flow animation
    // Pump -> Exchanger -> Heater -> Reactor -> HP Sep -> LP Sep -> Stripper -> Outlet
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 0.5, 2),   // Sour Feed
        new THREE.Vector3(-6, 0.6, 0),   // Mix with Hydrogen
        new THREE.Vector3(-4, 0.6, 0),   // Heat Exchanger
        new THREE.Vector3(0, 2, 0),      // Fired Heater
        new THREE.Vector3(4, 6, 0),      // Reactor Top
        new THREE.Vector3(4, 0.5, 0),    // Reactor Bottom
        new THREE.Vector3(8, 1.75, 1.5), // High Pressure Separator
        new THREE.Vector3(11, 1.25, 1.5),// Low Pressure Separator
        new THREE.Vector3(14, 7, 0),     // Stripper Column Top
        new THREE.Vector3(14, 0.5, 0),   // Stripper Column Bottom
        new THREE.Vector3(18, 0.4, 0)    // Sweet Product Outlet
    ]);

    // Hydrogen/H2S specific path (from HP Sep to Scrubber)
    const gasCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(8, 1.75, 1.5), // High Pressure Separator
        new THREE.Vector3(8, 3.5, 1.5),  // Upwards out of HP Sep
        new THREE.Vector3(8, 4.5, -2),   // Into Scrubber
        new THREE.Vector3(8, 1, -2),     // Through Scrubber
        new THREE.Vector3(-8, 1, -2)     // Recycle back to compressor
    ]);

    group.userData.update = (delta) => {
        pData.forEach(p => {
            p.progress += delta * 0.08;
            if (p.progress > 1) {
                p.progress = 0;
                p.mesh.material = p.isGas ? gasMat : liquidMat; // Reset colors
            }

            // Material transformations based on progress
            if (p.progress > 0.45 && p.progress <= 0.6) {
                // Post-reactor
                if (!p.isGas) {
                    p.mesh.material = cleanMat; // Liquid becomes clean product
                } else {
                    p.mesh.material = h2sMat; // Gas carries H2S
                }
            } else if (p.progress > 0.6 && p.isGas) {
                // Route gas to recycle scrubber after HP separator (progress ~0.6)
                // We'll simulate a branching path by hijacking the point calculation
                const localProg = (p.progress - 0.6) / 0.4; // scale to 0-1 for gas curve
                if (localProg <= 1) {
                    const point = gasCurve.getPoint(Math.min(localProg, 1));
                    p.mesh.position.copy(point);
                    if (localProg > 0.5) p.mesh.material = gasMat; // scrubbed clean H2
                }
                return; // skip the main liquid curve calculation
            }

            const point = curve.getPoint(p.progress);
            p.mesh.position.copy(point);
        });
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary purpose of a Hydrodesulfurization (HDS) unit?",
            options: [
                "To remove sulfur from natural gas and refined petroleum products",
                "To increase the octane rating of gasoline",
                "To crack heavy hydrocarbons into lighter ones",
                "To separate water from crude oil"
            ],
            correctAnswer: 0,
            explanation: "HDS is a catalytic chemical process widely used to remove sulfur (S) from natural gas and refined petroleum products, reducing sulfur dioxide emissions when the fuels are burned."
        },
        {
            question: "Which gas is required in large quantities for the HDS process?",
            options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon Dioxide"],
            correctAnswer: 2,
            explanation: "Hydrogen gas reacts with sulfur compounds under high pressure and temperature to form hydrogen sulfide (H2S), effectively removing the sulfur from the hydrocarbon molecules."
        },
        {
            question: "What is the function of the Fired Heater in an HDS unit?",
            options: [
                "To cool the product before separation",
                "To heat the feed and hydrogen mixture to the required reaction temperature",
                "To burn off excess hydrogen",
                "To separate liquid and gas phases"
            ],
            correctAnswer: 1,
            explanation: "The fired heater brings the mixed feed of hydrocarbons and hydrogen up to the elevated temperatures (300°C to 400°C) necessary for the catalytic reactions to occur."
        },
        {
            question: "In the catalytic reactor bed, sulfur is converted into which compound?",
            options: ["Sulfur dioxide (SO2)", "Hydrogen sulfide (H2S)", "Sulfuric acid (H2SO4)", "Elemental sulfur (S)"],
            correctAnswer: 1,
            explanation: "The catalyst promotes the reaction of hydrogen with sulfur compounds to produce Hydrogen Sulfide (H2S), a highly toxic and corrosive gas that is subsequently scrubbed and converted to elemental sulfur."
        },
        {
            question: "What is the role of the Recycle Gas Scrubber?",
            options: [
                "To remove H2S from the unreacted hydrogen so it can be reused",
                "To separate the final sweet product from sour product",
                "To distill the petroleum fractions",
                "To compress hydrogen gas for the reactor"
            ],
            correctAnswer: 0,
            explanation: "The scrubber typically uses an amine solution to absorb H2S from the recycle gas stream. This cleans the unreacted hydrogen so it can be compressed and safely returned to the reactor."
        },
        {
            question: "Why is a Stripper Column used at the end of the HDS process?",
            options: [
                "To add hydrogen back into the liquid",
                "To remove dissolved H2S and light hydrocarbon gases from the liquid product",
                "To filter out the solid catalyst particles",
                "To separate the oil into different boiling fractions"
            ],
            correctAnswer: 1,
            explanation: "The stripper column uses heat or a stripping gas (like steam) to drive off any remaining dissolved hydrogen sulfide and light gases, leaving a stabilized 'sweet' (low-sulfur) liquid product."
        }
    ];

    return group;
}
