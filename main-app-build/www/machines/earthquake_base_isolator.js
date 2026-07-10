export function createEarthquakeBaseIsolator(THREE) {
    const root = new THREE.Group();

    // Define distinct materials
    const matBase = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const matRails = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const matConcrete = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.9 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.4 });
    const matRubber = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const matColumn = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.7 });
    const matFloor = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.6 });
    const matDamper = new THREE.MeshStandardMaterial({ color: 0x0055ff, metalness: 0.7, roughness: 0.2 });
    const matSensor = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });

    // 1. Earthquake Simulator Base
    const simulatorBaseGeo = new THREE.BoxGeometry(24, 1, 12);
    const simulatorBase = new THREE.Mesh(simulatorBaseGeo, matBase);
    simulatorBase.position.y = -0.5;
    root.add(simulatorBase);

    // 2. Guide Rails
    const railsGeo = new THREE.BoxGeometry(24, 1.2, 0.5);
    const guideRail1 = new THREE.Mesh(railsGeo, matRails);
    guideRail1.position.set(0, 0.1, 4.5);
    const guideRail2 = new THREE.Mesh(railsGeo, matRails);
    guideRail2.position.set(0, 0.1, -4.5);
    const guideRails = new THREE.Group();
    guideRails.add(guideRail1, guideRail2);
    simulatorBase.add(guideRails);

    const groundGroup = new THREE.Group();
    root.add(groundGroup);

    // 3. Ground Foundation
    const foundationGeo = new THREE.BoxGeometry(12, 1.5, 8);
    const groundFoundation = new THREE.Mesh(foundationGeo, matConcrete);
    groundFoundation.position.y = 0.75;
    groundGroup.add(groundFoundation);

    // 4. Bottom Mounting Plate
    const bottomPlateGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.2, 32);
    const bottomMountingPlate = new THREE.Mesh(bottomPlateGeo, matSteel);
    bottomMountingPlate.position.y = 1.5 + 0.1;
    groundGroup.add(bottomMountingPlate);

    // 8. Displacement Sensors
    const sensorGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const displacementSensors = new THREE.Mesh(sensorGeo, matSensor);
    displacementSensors.position.set(3.5, 1.6, 0);
    groundGroup.add(displacementSensors);

    const buildingGroup = new THREE.Group();
    root.add(buildingGroup);

    // 6. Top Mounting Plate
    const topPlateGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.2, 32);
    const topMountingPlate = new THREE.Mesh(topPlateGeo, matSteel);
    topMountingPlate.position.y = 3.5;
    buildingGroup.add(topMountingPlate);

    // 9. Supported Column
    const columnGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 32);
    const supportedColumn = new THREE.Mesh(columnGeo, matColumn);
    supportedColumn.position.y = 3.5 + 0.1 + 2.5; // 6.1
    buildingGroup.add(supportedColumn);

    // 10. Building Floor
    const floorGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const buildingFloor = new THREE.Mesh(floorGeo, matFloor);
    buildingFloor.position.y = 6.1 + 2.5 + 0.25; // 8.85
    buildingGroup.add(buildingFloor);

    // 5. Lead Rubber Bearing
    const bearingHeight = 1.8;
    const bearingGeo = new THREE.CylinderGeometry(1.8, 1.8, bearingHeight, 32);
    const leadRubberBearing = new THREE.Mesh(bearingGeo, matRubber);
    root.add(leadRubberBearing);

    // 7. Dampers
    const damperGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const damper1 = new THREE.Mesh(damperGeo, matDamper);
    const damper2 = new THREE.Mesh(damperGeo, matDamper);
    const dampers = new THREE.Group();
    dampers.add(damper1, damper2);
    root.add(dampers);

    // Data for animation and quizzes
    root.userData = {
        time: 0,
        lastGroundX: 0,
        buildingPosition: 0,
        buildingVelocity: 0,
        groundGroup: groundGroup,
        buildingGroup: buildingGroup,
        bearing: leadRubberBearing,
        damper1: damper1,
        damper2: damper2,
        bottomY: 1.6,
        topY: 3.5,
        quiz: [
            {
                question: "What is the primary function of a base isolator in a building?",
                options: [
                    "To rigidly connect the building to the ground",
                    "To decouple the building from ground motion",
                    "To increase the building's mass",
                    "To amplify earthquake vibrations"
                ],
                correct: 1
            },
            {
                question: "What is the purpose of the lead core in a Lead Rubber Bearing (LRB)?",
                options: [
                    "To provide energy dissipation (damping)",
                    "To increase the building's bounce",
                    "To make the bearing lighter",
                    "To prevent vertical movement"
                ],
                correct: 0
            },
            {
                question: "Why are alternating layers of rubber and steel used in the bearing?",
                options: [
                    "To make it electrically conductive",
                    "To provide vertical stiffness and horizontal flexibility",
                    "To generate heat during an earthquake",
                    "To make it completely rigid"
                ],
                correct: 1
            },
            {
                question: "How does a base-isolated building move compared to a fixed-base building during an earthquake?",
                options: [
                    "It sways more violently at the top",
                    "It moves more uniformly as a rigid block",
                    "It remains completely stationary",
                    "It vibrates at a much higher frequency"
                ],
                correct: 1
            },
            {
                question: "What is the role of supplemental dampers in this system?",
                options: [
                    "To support the building's weight",
                    "To reduce the horizontal displacement of the isolators",
                    "To generate electricity",
                    "To increase the earthquake's force"
                ],
                correct: 1
            },
            {
                question: "Which type of building benefits most from base isolation?",
                options: [
                    "Extremely tall, flexible skyscrapers",
                    "Low to medium-rise stiff buildings",
                    "Underground bunkers",
                    "Lightweight wooden sheds"
                ],
                correct: 1
            }
        ],
        update: function(deltaTime) {
            this.time += deltaTime;

            // 1. Simulate Earthquake Ground Motion
            const groundX = Math.sin(this.time * 8.0) * 1.5 + Math.sin(this.time * 13.0) * 0.5 + Math.sin(this.time * 3.0) * 1.0;
            const groundV = deltaTime > 0 ? (groundX - this.lastGroundX) / deltaTime : 0;
            this.lastGroundX = groundX;

            this.groundGroup.position.x = groundX;

            // 2. Physics Simulation for the Building (Spring-Damper System)
            // m * a = -k * (x_b - x_g) - c * (v_b - v_g)
            const k = 20.0;  // Stiffness of the bearing
            const c = 8.0;   // Damping coefficient
            const m = 15.0;  // Mass of the building

            const springForce = -k * (this.buildingPosition - groundX);
            const dampingForce = -c * (this.buildingVelocity - groundV);
            const acceleration = (springForce + dampingForce) / m;

            this.buildingVelocity += acceleration * deltaTime;
            this.buildingPosition += this.buildingVelocity * deltaTime;

            this.buildingGroup.position.x = this.buildingPosition;

            // 3. Update Visuals
            // Bearing shear deformation
            this.bearing.position.set(
                (groundX + this.buildingPosition) / 2,
                (this.bottomY + this.topY) / 2,
                0
            );
            const dx = this.buildingPosition - groundX;
            this.bearing.rotation.z = -Math.atan2(dx, this.topY - this.bottomY);

            // Dampers stretching/compressing
            const d1Ground = new THREE.Vector3(groundX - 4, this.bottomY, 2);
            const d1Top = new THREE.Vector3(this.buildingPosition - 2, this.topY, 2);
            this.damper1.position.copy(d1Ground).lerp(d1Top, 0.5);
            this.damper1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d1Top.clone().sub(d1Ground).normalize());
            this.damper1.scale.y = d1Ground.distanceTo(d1Top);

            const d2Ground = new THREE.Vector3(groundX + 4, this.bottomY, -2);
            const d2Top = new THREE.Vector3(this.buildingPosition + 2, this.topY, -2);
            this.damper2.position.copy(d2Ground).lerp(d2Top, 0.5);
            this.damper2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d2Top.clone().sub(d2Ground).normalize());
            this.damper2.scale.y = d2Ground.distanceTo(d2Top);
        }
    };

    return root;
}
