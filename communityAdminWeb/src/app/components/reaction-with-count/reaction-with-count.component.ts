import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-reaction-with-count",
  templateUrl: "./reaction-with-count.component.html",
  styleUrls: ["./reaction-with-count.component.scss"],
})
export class ReactionWithCountComponent implements OnInit, OnChanges {
  likeSmall: string = "assets/reactions/reactionsSingleLike.svg";
  careSmall: string = "assets/reactions/reactionsSingleCare.svg";
  celebrateSmall: string = "assets/reactions/reactionsSingleCelebrate.svg";
  ideaSmall: string = "assets/reactions/reactionsSingleGoodIdea.svg";
  reactions: any = {};
  reactionCount: number = 0;
  count: any;

  @Input() data: any;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    // Updating Data on Parent Component Changes
    this.reactions = this.data;
    this.count = this.reactions?.count;
    this.reactionCount = this.reactions?.count?.total;
  }

  ngOnInit(): void {
    // Initializing Data based on Prop
    this.reactions = this.data;
    this.count = this.reactions?.count;
    this.reactionCount = this.reactions?.count?.total;
  }
}
