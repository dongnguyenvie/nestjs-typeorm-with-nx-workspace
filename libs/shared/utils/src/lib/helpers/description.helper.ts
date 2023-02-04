export class GraphqlDescription {
  private isPublic: boolean | undefined;
  private isSystem: boolean | undefined;
  private group: string | undefined;
  private isSub: boolean | undefined;
  private title: string | undefined;
  private description: string | undefined;
  private isDeleted: boolean | undefined;
  private isDefault: boolean | undefined;

  constructor(partial: Partial<GraphqlDescription> = {}) {
    Object.assign(this, partial);
  }

  get toJson() {
    return JSON.stringify({
      publ: this.isPublic,
      t: this.title,
      desc: this.description,
      sys: this.isSystem,
      sub: this.isSub,
      gr: this.group,
      d: this.isDefault,
    });
  }

  static Builder = class {
    public isPublic = false;
    public isSystem = false;
    public isSub = false;
    public title = '';
    public description = '';
    public group = '';
    public isDelete = false;
    public isDefault = false;
    constructor() {}

    public withPublic() {
      this.isPublic = true;
      return this;
    }

    public withSystem() {
      this.isSystem = true;
      return this;
    }

    public withSub() {
      this.isSub = true;
      return this;
    }

    public withGroup(group: string) {
      this.group = group;
      return this;
    }

    public withTitle(title: string) {
      this.title = title;
      return this;
    }

    public withDesc(description: string) {
      this.description = description;
      return this;
    }

    public withDelete() {
      this.isDelete = false;
      return this;
    }

    public withDefault() {
      this.isDefault = true;
      return this;
    }

    public build() {
      const desc = new GraphqlDescription();
      desc.isPublic = this.isPublic;
      desc.description = this.description;
      desc.title = this.title;
      desc.isSystem = this.isSystem;
      desc.isSub = this.isSub;
      desc.group = this.group;
      desc.isDeleted = this.isDelete;
      desc.isDefault = this.isDefault;
      return desc.toJson;
    }
  };

  static API() {
    return new this.Builder();
  }

  static fromString(str: string) {
    try {
      const desc = JSON.parse(str);
      return new GraphqlDescription(desc);
    } catch (error) {
      return {};
    }
  }
}
