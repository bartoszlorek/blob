class Constraint {
  constructor({actorA, actorB, resolver, effect}) {
    this.actorA = actorA;
    this.actorB = actorB;

    // methods
    this.resolver = resolver;
    this.effect = effect;

    // flags
    this.isActive = true;
  }

  update(deltaTime) {
    if (this.isActive === true) {
      this.resolver(this, deltaTime);
    }
  }

  removeActor(actor) {
    if (this.actorA === actor || this.actorB === actor) {
      this.isActive = false;
    } else {
      if (this.actorA.isGroup) {
        this.validateGroup(this.actorA, actor);
      }
      if (this.actorB.isGroup) {
        this.validateGroup(this.actorB, actor);
      }
    }
  }

  validateGroup(group, actor) {
    if (this.isActive) {
      // cleanup group's children
      if (group.contains(actor)) {
        group.remove(actor);

        if (group.isEmpty()) {
          this.isActive = false;
        }
      }
    } else {
      // maybe it should be enabled again
      if (!group.isEmpty()) {
        this.isActive = true;
      }
    }
  }
}

export default Constraint;
