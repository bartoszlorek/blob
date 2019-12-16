class Constraint {
  constructor({actorA, actorB, resolver, effect}) {
    this.actorA = actorA;
    this.actorB = actorB;

    // methods
    this.update = resolver(this);
    this.effect = effect;

    // flags
    this.isActive = true;
  }

  verificate(actor) {
    if (this.actorA === actor || this.actorB === actor) {
      this.isActive = actor.isAlive;
    } else {
      if (this.actorA.isGroup) {
        this.verificateGroup(this.actorA, actor);
      }
      if (this.actorB.isGroup) {
        this.verificateGroup(this.actorB, actor);
      }
    }
  }

  verificateGroup(group, actor) {
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
