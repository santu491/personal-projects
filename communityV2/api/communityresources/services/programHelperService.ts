import { Service } from 'typedi';
import {
  AttributeTagCountChild,
  AttributeTagCountChildSubChild,
  Office,
  ProgramListResponse,
  ProgramResponse
} from '../models/programsModel';

@Service()
export class ProgramHelperService {
  async buildProgram(programData: ProgramResponse) {
    if (programData === null) {
      return null;
    }
    const program = new ProgramResponse();
    program.attribute_tags = programData.attribute_tags;
    program.availability = programData.availability;
    program.central_hours_of_operation = programData.central_hours_of_operation;
    program.coverage_description = programData.coverage_description;
    program.description = programData.description;
    program.directions = programData.directions;
    program.entry_date = programData.entry_date;
    program.facebook_url = programData.facebook_url;
    program.free_or_reduced = programData.free_or_reduced;
    program.google_plus_id = programData.google_plus_id;
    program.grain = programData.grain;
    program.grain_location = programData.grain_location;
    program.id = programData.id;
    program.isOfficeAvailable = programData.isOfficeAvailable;
    program.name = programData.name;
    program.next_steps = programData.next_steps;
    program.offices = await this.getProgramOffices(programData.offices);
    program.program_numeric_id = programData.program_numeric_id;
    program.provider_name = programData.provider_name;
    program.provider_numeric_id = Number(programData.provider_numeric_id);
    program.rules = programData.rules;
    program.score = programData.score;
    program.service_tags = programData.service_tags;
    program.supported_languages = programData.supported_languages;
    program.twitter_id = programData.twitter_id;
    program.update_date = programData.update_date;
    program.validation_date = programData.validation_date;
    program.video_url = programData.video_url;
    program.website_url = programData.website_url;
    program.wl_score = programData.wl_score;
    return program;
  }

  async buildProgarmList(programListData: ProgramListResponse) {
    if (programListData) {
      const programList = new ProgramListResponse();
      programList.attribute_tag_counts = await this.getAttributeTagCountChildren(
        programListData.attribute_tag_counts
      );
      programList.count = programListData.count;
      programList.language_counts = await this.getAttributeTagCountChildSubChildren(
        programListData.language_counts
      );
      programList.postal_location = programListData.postal_location;
      programList.programs = await this.buildPrograms(programListData.programs);
      programList.suggestion = programListData.suggestion;

      return programList;
    }

    return null;

  }

  async buildPrograms(progarmData: ProgramResponse[]) {
    if (progarmData) {
      const proramList: ProgramResponse[] = [];
      progarmData.forEach(async (data) => {
        const buildData = await this.buildProgram(data);
        proramList.push(buildData);
      });
      return proramList;
    }
    return null;
  }

  async getAttributeTagCountChildren(
    attributeTagCounts: AttributeTagCountChild[]
  ) {
    const attributeTagCountChildren = [];
    if (attributeTagCounts) {
      attributeTagCounts.forEach(async (attributeTagCount) => {
        const child = new AttributeTagCountChild();
        child.children = await this.getAttributeTagCountChildSubChildren(
          attributeTagCount.children
        );
        child.name = attributeTagCount.name;
        attributeTagCountChildren.push(child);
      });
      return attributeTagCountChildren;
    }

    return null;
  }

  async getAttributeTagCountChildSubChildren(
    children: AttributeTagCountChildSubChild[]
  ) {
    const attributeTagCountChildSubChildren = [];
    if (children) {
      children.forEach(async (child) => {
        const attributeTagCountChildSubChild = new AttributeTagCountChildSubChild();
        if (child?.children !== undefined && child?.children !== null) {
          attributeTagCountChildSubChild.children = await this.getAttributeTagCountChildSubChildren(
            child.children
          );
        }
        if (child?.count !== undefined && child?.count !== null) {
          attributeTagCountChildSubChild.count = child.count;
        }
        attributeTagCountChildSubChild.name = child.name;
        attributeTagCountChildSubChildren.push(attributeTagCountChildSubChild);
      });
      return attributeTagCountChildSubChildren;
    }
    return null;
  }

  async getProgramOffices(officesData: Office[]) {
    const officesList = [];
    if (officesData === null) {
      return null;
    }
    officesData.forEach((office) => {
      if (office.hasOwnProperty('address3')) {
        delete office.address3;
      }
      if (office.website_url === '') {
        delete office.website_url;
      }
      officesList.push(office);
    });
    return officesList;
  }
}
