import React, { Component } from "react";
//import { Link, Redirect } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  GooglePlusShareButton,
  VKShareButton,
  TumblrShareButton,
  EmailShareButton,
  OKShareButton,
  MailruShareButton
} from 'react-share';

import {
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  GooglePlusIcon,
  VKIcon,
  TumblrIcon,
  EmailIcon,
  OKIcon,
  MailruIcon
} from 'react-share';

class PopUp extends Component {

  render() {
    return (
      <div style={{display: this.props.display ? "flex" : "none"}} className="recipe__popup-screen-cover">
        <div className="recipe__wrapper-semitransparent-cover" onClick={() => this.props.toggleSharePopup()}></div>
        <Carousel styles={styles}
            className="recipe__popup-wrapper"
            showArrows={false}
            showStatus={false}
            showThumbs={false}>
            <div className="recipe__popup-row">
                <FacebookShareButton url={this.props.url} className="recipe__social-btn" quote="Cookbook recipe">
                    <FacebookIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </FacebookShareButton>
                <TwitterShareButton url={this.props.url} className="recipe__social-btn" title="Cookbook recipe">
                    <TwitterIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </TwitterShareButton>
                <TelegramShareButton url={this.props.url} className="recipe__social-btn" title="Cookbook recipe">
                    <TelegramIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </TelegramShareButton>
                <WhatsappShareButton url={this.props.url} className="recipe__social-btn" title="Cookbook recipe">
                    <WhatsappIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </WhatsappShareButton>
                <GooglePlusShareButton url={this.props.url} className="recipe__social-btn">
                    <GooglePlusIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </GooglePlusShareButton>
            </div>
            <div className="recipe__popup-row">
                <VKShareButton url={this.props.url} className="recipe__social-btn" title="Cookbook recipe" description={this.props.url}>
                    <VKIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </VKShareButton>
                <TumblrShareButton url={this.props.url} className="recipe__social-btn" title="Cookbook recipe">
                    <TumblrIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </TumblrShareButton>
                <EmailShareButton url={this.props.url} className="recipe__social-btn" subject="Cookbook recipe" body={this.props.url}>
                    <EmailIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </EmailShareButton>
                <OKShareButton url={this.props.url} className="recipe__social-btn" title="Cookbook recipe" description={this.props.url}>
                    <OKIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </OKShareButton>
                <MailruShareButton url={this.props.url} className="recipe__social-btn" title="Cookbook recipe" description={this.props.url}>
                    <MailruIcon size={40} round={true} onClick={() => this.props.toggleSharePopup()} />
                </MailruShareButton>
            </div>
        </Carousel>
      </div>
    )
  }
}

export default PopUp;