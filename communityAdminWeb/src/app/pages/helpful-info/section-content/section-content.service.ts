import { Injectable } from '@angular/core';
import {
  articleProviders,
  contentType,
  helpfulInfo
} from 'src/app/core/constants';
import { Content, ExternalLinkData, SectionContentArray } from 'src/app/core/models/helpfulInfo';
import { generateHexId } from 'src/app/core/utils';

@Injectable({
  providedIn: 'root'
})
export class SectionContentService {
  enBucket!: any;
  esBucket!: any;
  selectedSubSectionIndex = -1;
  selectedExternalLink!: ExternalLinkData;

  constructor() {}

  deleteArticle(contentList: any[], article: any) {
    const newArticleList = contentList.filter(
      (c) => !(c?.contentId === article?.contentId && c?.link === article?.link)
    );

    return newArticleList;
  }

  // Identify articles that need to be added to new Section from sectionContent
  // These are Meredith Articles or custom articles
  getOtherIndexes(sectionContent: any[]) {
    const indexes: number[] = [];
    sectionContent.forEach((c: any, i: number) => {
      if (
        c?.type === contentType.article &&
        !c?.link?.includes('healthWise') &&
        !c?.link?.includes('referenceContent') &&
        (c?.provider === articleProviders.meredith ||
          c?.provider === articleProviders.other)
      ) {
        indexes.push(i);
      }
    });

    return indexes;
  }

  //Return a reference Library structure
  getReferenceLibrary(
    newLibraryId: string,
    sectionContent: any,
    libraryTitle?: string
  ) {
    const subSectionId = generateHexId();
    const newLibraryData = {
      en: {
        title: libraryTitle ?? helpfulInfo.referencePlaceholder,
        description: '',
        helpfulInfoId: newLibraryId,
        headerTitle: libraryTitle ?? helpfulInfo.referencePlaceholder,
        headerDescription: '',
        communityId: '',
        sections: [
          {
            title: '',
            description: '',
            type: helpfulInfo.sectionListType,
            sectionId: subSectionId,
            content: sectionContent.en
          }
        ]
      },
      es: {
        title: libraryTitle ?? helpfulInfo.referencePlaceholder,
        description: '',
        helpfulInfoId: newLibraryId,
        headerTitle: libraryTitle ?? helpfulInfo.referencePlaceholder,
        headerDescription: '',
        communityId: '',
        sections: [
          {
            title: '',
            description: '',
            type: helpfulInfo.sectionListType,
            sectionId: subSectionId,
            content: sectionContent.es
          }
        ]
      }
    };

    return newLibraryData;
  }

  formatRequestArticle(article: any, index: number) {
    article.communityId = '';
    article.type = article.type ?? '';
    article.contentId = article.contentId ?? '';
    article.title = article.title ?? '';
    article.description = article.description ?? '';
    article.link = article.link ?? '';
    article.video = article.video ?? '';
    article.thumbnail = article.thumbnail ?? '';
    if (article?.isModified) {
      delete article.isModified;
    }
  }

  setBucketContentReferencePath(
    indexes: number[],
    newContent: SectionContentArray,
    libraryId: string
  ) {
    indexes.forEach((i) => {
      newContent.en.push(this.enBucket.sections[0].content[i]);
      newContent.es.push(this.esBucket.sections[0].content[i]);

      this.enBucket.sections[0].content[i] = {
        ...this.enBucket.sections[0].content[i],
        link: `${helpfulInfo.referenceContentPath}${libraryId}/${this.enBucket.sections[0].content[i].contentId}${helpfulInfo.htmlParameter}`,
        description: '',
        copyright: ''
      };
      this.esBucket.sections[0].content[i] = {
        ...this.esBucket.sections[0].content[i],
        link: `${helpfulInfo.referenceContentPath}${libraryId}/${this.esBucket.sections[0].content[i].contentId}${helpfulInfo.htmlParameter}`,
        description: '',
        copyright: ''
      };
    });
  }

  getContentId(article: Content) {
    if (article.contentId === '') {
      const paths = article.link.split('?');
      const pathParts = paths[0].split('/');
      return pathParts[pathParts.length - 1];
    } else {
      return article.contentId;
    }
  }

  getArticleIndex(contents: Content[], article: Content) {
    return contents.findIndex(
      (c: any) => c.contentId === article.contentId && c.link === article.link
    );
  }

  getMeredithArticleIndex(contents: Content[], article: Content) {
    return contents.findIndex((c: any) => c.contentId === article.contentId);
  }
}
